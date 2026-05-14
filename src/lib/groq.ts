import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const CHAT_MODEL = "llama3-70b-8192";
