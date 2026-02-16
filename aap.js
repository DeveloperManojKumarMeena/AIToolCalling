import { config } from "dotenv";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core"

config()
const groq = new Groq({ apiKey: process.env.GROK_API_KEY })
const tvly = tavily({ apiKey:process.env.TAVILY_API_KEY });

async function main() {
    const completions = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        messages: [
            {
                role: 'system',
                content: `you are a smart personal assistant who answer the asked question and your name is PavilionAI.
                 You have access to following tools:
                 1.searchWeb({query} : {query:string})//Search the latest information and real time data on the internet. `
            },
            {
                role: "user",
                content: "on 15-02-2026 in R Premadasa Stadium Colombo who win the match ?"
            }
        ],
        tools: [
            {
                type: "function",
                function: {
                    name: "webSearch",
                    description: "Search the latest information and realtime data on the internet",
                    parameters: {
                        // JSON Schema object
                        type: "object",
                        properties: {
                            query: {
                                "type": "string",
                                "description": "the search query to perform search on."
                            },
                           
                        },
                        "required": ["query"]
                    }
                }
            }
        ],
        tool_choice:'auto'
    })

    const toolCalls = completions.choices[0].message.tool_calls

    if(!toolCalls){
        console.log(`AI message : ${completions.choices[0].message.content}`)
        return;
    }

    for(const tool of toolCalls){
        console.log('tool :', tool)
        const functionName= tool.function.name;
        const functionParams = tool.function.arguments;

        if(functionName === 'webSearch'){
           const toolResult = await webSearch(JSON.parse(functionParams))
           console.log(`Here is tool result ${toolResult}`)
        }
    }

    // console.log(JSON.stringify(completions.choices[0].message , null,2))
}
main()

async function webSearch({ query }) {
 
    const response = await tvly.search(query);
    console.log('tvly response here :- ' ,response)
    return response
}