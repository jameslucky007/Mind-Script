// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import ollama from "ollama";

// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Chat endpoint
// app.post("/chat", async (req, res) => {
//   const { message } = req.body;

//   try {
//     const response = await ollama.chat({
//       model: "llama2", // update to the model you want
//       messages: [{ role: "user", content: message }],
//     });

//     // response.message.content contains the reply
//     res.json({ reply: response.message.content });
//   } catch (error) {
//     console.error("Ollama API error:", error.message);
//     res.status(500).json({ error: "Something went wrong with Ollama." });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
