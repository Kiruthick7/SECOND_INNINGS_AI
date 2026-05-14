import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { matchSituation } = await req.json();

    const prompt = `
      Based on this cricket match situation, generate 2 creative prediction prompts for fans.
      Situation: ${JSON.stringify(matchSituation)}
      
      Format the response as JSON:
      {
        "predictions": [
          {
            "question": "string",
            "options": [{"id": "1", "label": "string", "odds": "string"}],
            "xpReward": number
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    return NextResponse.json(data);
  } catch (error) {
    console.error("GROQ API Error:", error);
    return NextResponse.json({ error: "Failed to generate predictions" }, { status: 500 });
  }
}
