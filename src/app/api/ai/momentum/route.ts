import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { matchStats } = await req.json();

    const prompt = `
      You are a world-class cricket analyst. Analyze the following match stats and explain the current momentum shift in ONE punchy, high-energy sentence for a futuristic sports app.
      
      Stats: ${JSON.stringify(matchStats)}
      
      Requirements:
      - Max 150 characters.
      - Use terms like "momentum", "aggressive", "strike rotation", "tactical", etc.
      - Return ONLY the sentence.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.7,
    });

    const explanation = chatCompletion.choices[0]?.message?.content || "The match is hanging in a delicate balance as both sides fight for control.";

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("GROQ API Error:", error);
    return NextResponse.json({ error: "Failed to generate momentum" }, { status: 500 });
  }
}
