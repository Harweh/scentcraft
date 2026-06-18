import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import OpenAI from 'openai'

// Talking directly to the openai package, no LangChain wrapper involved
// This tells us definitively whether Puter's endpoint supports embeddings
const client = new OpenAI({
    apiKey: process.env.PUTER_AUTH_TOKEN,
    baseURL: 'https://api.puter.com/puterai/openai/v1/',
    })

    async function test() {
    try {
        const response = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: 'warm, confident, like a fireplace in winter',
        })

        console.log('✅ SUCCESS')
        console.log('Vector length:', response.data[0].embedding.length)
        console.log('First 5 numbers:', response.data[0].embedding.slice(0, 5))

    } catch (error) {
        console.log('❌ FAILED')
        console.log('Status:', error.status)
        console.log('Message:', error.message)
    }
}

test()