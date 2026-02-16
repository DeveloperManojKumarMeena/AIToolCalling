import { config } from "dotenv";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core"

config()
const groq = new Groq({apiKey:process.env.GROK_API_KEY})

async function main() {
    const completions = await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        temperature:0,
        messages:[
            {
                role:'system',
                content:'you are a smart personal assistant who answer the asked question and your name is PavilionAI'
            },
            {
                role:"user",
                content:"what is iphone 15 launched date?"
            }
        ]
    })
    console.log(completions.choices[0].message)
}
main()