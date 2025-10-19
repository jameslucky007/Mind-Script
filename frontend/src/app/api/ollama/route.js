import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, model, max_tokens } = await req.json();

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        options: { num_predict: max_tokens },
        stream: false,
      }),
    });

    const data = await response.json();
    console.log("ollama raw:", data);

    return NextResponse.json({
      output: data.response || data, 
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
