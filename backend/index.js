import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import ollama from "ollama";
import { createWorker } from 'tesseract.js';
import fileUpload from "express-fileupload";
import path from 'path'
import { fileURLToPath } from "url";
import HistoryModel from "./models/history.js";
import dbConnection from "./DBconnect.js";
import { title } from "process";

const app = express();
const PORT = 14000;
 dbConnection()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles:false,
    limits:{
      fileSize: 10*1024*1024
    },
    abortOnLimit:true,
    createParentPath:true,

  })
)

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

   try {
    const response = await ollama.chat({
      model: "gpt-oss:20b-cloud", 
      messages: [
        { role: "system", content: "You are Veritas AI, a professional fact-checking assistant dedicated to verifying information accuracy and combating misinformation. Your primary mission is to provide clear, evidence-based assessments of claims and statements. Keep responses concise and under 50 words unless specifically asked for detailed explanations. Be direct, professional, and informative using clear, accessible language that any user can understand. When evaluating claims, always provide a clear verdict of TRUE, FALSE, PARTIALLY TRUE, or UNVERIFIED along with brief reasoning explaining why this conclusion was reached. Reference credible sources when available and provide important context or nuances. Use response formats like FALSE Claim is incorrect Brief explanation with evidence or TRUE: This claim is accurate based on source evidence or PARTIALLY TRUE While accurate part, [inaccurate part] or UNVERIFIED: Insufficient reliable evidence to confirm this claim. If users become abusive or use inappropriate language, politely redirect by saying Let's focus on fact-checking. What claim would you like me to verify? Remain neutral and objective regardless of political, cultural, or personal biases. Acknowledge limitations by clearly stating when you cannot verify something and avoid speculation by sticking to verifiable facts. Cross-reference multiple reliable sources when possible, identify common misinformation patterns, explain why certain sources are more credible than others, provide context about how misinformation spreads, and offer guidance on media literacy when relevant. When asked Who are you? respond: I am Veritas AI, a fact-checking assistant designed to help verify information accuracy and identify misinformation. How can I help you fact-check something today? Prioritize accuracy over speed, cite specific credible sources when possible, distinguish between facts and opinions clearly, update assessments if new evidence emerges, and maintain transparency about confidence levels in assessments."  },
        { role: "user", content: message },
      ],
      options: {
        temperature: 0.7,
        num_ctx: 2048, 
      },
    });

    res.json({ reply: response.message.content });
  } catch (err) {
    console.error("Ollama API error:", err?.message || err);
    res.status(500).json({ error: "Ollama request failed." });
  }
});

//! fast version 
app.post("/chat-stream", async (req, res) => {
  const { message, userEmail } = req.body;
  if(!userEmail) return res.json({message:"You are not logged in"})
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const stream = await ollama.chat({
      model: "gpt-oss:20b-cloud",
      stream: true,
      messages: [{ role: "user", content: message }],
      options:{
        system: "I want you give me answer in 50 words"
      }
    });


      // find or create history
    let myHistory = await HistoryModel.findOne({ title: message });
    if (!myHistory) {
      myHistory = await HistoryModel.create({
        userEmail,
        title: message,
        history: "",
      });
    }

    let collected = myHistory.history || "";

    for await (const part of stream) {
      const chunk = part.message?.content ?? "";
      collected += chunk;

      // res.write(part.message?.content ?? "");
       // update incrementally
      await HistoryModel.findByIdAndUpdate(myHistory._id, { history: collected });

      res.write(chunk);
    }
    res.end();
  } catch (e) {
    console.error(e?.message || e);
    res.write("\n[ERROR]");
    res.end();
  }
});

// app.post('/extract-image', async (req, res) => {
//   console.log(req.body);
//   const image = req.files.image
//   if(!image) throw new Error('Please upload images')

//   try {
//   const worker = await createWorker({ logger: m => console.log(m) });
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const { data: { text } } = await worker.recognize(image);
  
//   res.status(200).json({
//     status:"success",
//     message: "data extracted",
//     text: text
//   })
//   await worker.terminate();
    
//   } catch (error) {
//     throw error
//   }
// } )

app.post("/extract-image", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Please upload an image" });
    }
    const image = req.files.image;
    // Save file to /images folder
    const uploadPath = path.join(__dirname, "images", image.name);
    await image.mv(uploadPath);

    // OCR
    const worker = await createWorker({ logger: m => console.log(m) });
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data: { text } } = await worker.recognize(uploadPath);

    res.status(200).json({
      status: "success",
      message: "data extracted",
      text,
    });

    await worker.terminate();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/myhistory/:email', async (req,res)=>{

  const {email} = req.params
  try {
    const history = await HistoryModel.find({userEmail:email})
    if(!history || history.length === 0){
      res.status(404).json({
        message:"You dont have any chat yet!"
      })
      return
    }
    res.status(200).json({
      status:"success",
      message:"History fetched",
      history: history
    })
  } catch (error) {
    console.log(error);
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
