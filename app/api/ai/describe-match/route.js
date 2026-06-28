import { NextResponse } from 'next/server'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
import { MongoClient } from 'mongodb'
import embeddings from '@/lib/embeddings.js'
import OpenAI from 'openai'
import { MIXING_FEE, VIAL_COST } from '@/lib/pricing.js'


// This tells Next.js to run this route in Node.js runtime
// Required because @langchain/mongodb only works in Node — not the Edge runtime
export const runtime = 'nodejs'


/**
 * @swagger
 * /api/ai/describe-match:
 *   post:
 *     summary: AI-matched perfume from a mood description
 *     description: Embeds the customer's description, searches the vector index for the closest real fragrances, and generates a name + description using only matched results (RAG)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description]
 *             properties:
 *               description:
 *                 type: string
 *                 example: I want to feel warm, confident and mysterious
 *               gender:
 *                 type: string
 *                 enum: [male, female, unisex]
 *     responses:
 *       200:
 *         description: Matched fragrances with AI-generated name and description
 *       400:
 *         description: Description missing or too short
 *       404:
 *         description: No matching fragrances found
 */



// ══════════════════════════════════════════════════════
// POST /api/ai/describe-match
// The full RAG pipeline — search + generate
//
// Request body:
// {
//   description: "I want to feel warm and mysterious",
//   gender: "female" | "male" | "unisex"  ← optional
// }
//
// Response:
// {
//   success: true,
//   perfumeName: "Golden Ember",
//   scentDescription: "A rich, enveloping blend...",
//   matchedFragrances: [...],
//   pricing: { fragranceCost, mixingFee, vialCost, totalAmount }
// }
// ══════════════════════════════════════════════════════
export async function POST(request) {
    let client = null

    try {
        // ── STEP 1: Read and validate the request
        const body = await request.json()
        const { description, gender } = body

        if (!description || description.trim().length < 5) {
        return NextResponse.json(
            {
            success: false,
            message: 'Please describe how you want to feel in at least a few words',
            },
            { status: 400 }
        )
        }

        // ── STEP 2: Connect to MongoDB using native driver ─────
        // Important: LangChain's MongoDBAtlasVectorSearch uses the
        // NATIVE MongoDB driver directly, not Mongoose.
        // That's why we use MongoClient here instead of our connectDB()
        // utility — they're two different ways to talk to the same database
        client = new MongoClient(process.env.MONGODB_URI)
        await client.connect()

        const db = client.db('scentcraft')
        const collection = db.collection('fragrances')

        // ── STEP 3: Set up the vector store
        // MongoDBAtlasVectorSearch connects our embeddings model
        // to the vector_index we created in Step 9.
        // It knows WHERE to search (our collection) and
        // HOW to search (using our embeddings to convert text → numbers)
        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: 'vector_index',    // must match exactly what we named it in Atlas
        textKey: 'description',       // the field Atlas indexes text from
        embeddingKey: 'embedding',    // the field storing our 384 numbers
        })

        // ── STEP 4: Semantic search ────────────────────────────
        // This is the core of RAG — "Retrieval"
        // similaritySearch() does three things automatically:
        // 1. Embeds the customer's description using our HuggingFace model
        // 2. Runs cosine similarity against all 384-number vectors in Atlas
        // 3. Returns the top 3 most semantically similar fragrances
        //
        // "warm and confident" will match Sandalwood + Amber even though
        // those exact words never appear in either description
        const results = await vectorStore.similaritySearch(description.trim(), 3)

        if (!results || results.length === 0) {
        return NextResponse.json(
            {
            success: false,
            message: 'No matching fragrances found. Try describing your mood differently.',
            },
            { status: 404 }
        )
        }

        // ── STEP 5: Extract matched fragrance data ─────────────
        // results comes back as LangChain Document objects
        // Each has a .metadata field containing the original MongoDB document
        // We pull out just the fields we need for pricing and display
        const matchedFragrances = results.map((doc, index) => {
        const roles = ['Base', 'Heart', 'Top']
        return {
            name: doc.metadata.name,
            emoji: doc.metadata.emoji,
            category: doc.metadata.category,
            description: doc.metadata.description,
            pricePerMl: doc.metadata.pricePerMl,
            color: doc.metadata.color,
            role: roles[index] || 'Base',  // assign Base/Heart/Top in order of match score
            mlUsed: 2,
        }
        })

        // ── STEP 6: Calculate pricing ──────────────────────────
        // Same business logic as our order routes
        // PRD: $15 mixing fee + $5 vial + (pricePerMl × mlUsed) per note
        const fragranceCost = matchedFragrances.reduce(
        (sum, f) => sum + f.pricePerMl * f.mlUsed, 0
        )
        const mixingFee = MIXING_FEE
        const vialCost  = VIAL_COST
        const totalAmount = fragranceCost + mixingFee + vialCost

        // ── STEP 7: Build the Puter prompt ─────────────────────
        // This is where gender acts as a SOFT SIGNAL, not a hard filter
        // The customer's own words ("warm and mysterious") always take priority
        // Gender just adjusts the tone and vocabulary of the output description
        const fragranceList = matchedFragrances
        .map(f => `${f.emoji} ${f.name} (${f.role} note) — ${f.description}`)
        .join('\n')

        const genderContext = gender && gender !== 'unisex'
        ? `The customer identifies as ${gender} and generally leans toward ${
            gender === 'female'
                ? 'floral, warm, and romantic scents — though their mood description takes priority'
                : 'woody, fresh, and bold scents — though their mood description takes priority'
            }.`
        : 'The customer has no gender preference — suggest a universally appealing blend.'

        const systemPrompt = `You are a master perfumer and poet at a luxury fragrance studio. 
    You create evocative, beautiful descriptions of custom perfume blends. 
    Your tone is warm, sensory, and aspirational — like a high-end fragrance brand.
    Always respond in valid JSON only. No markdown, no extra text.`

        const userPrompt = `A customer wants to feel: "${description}"

    ${genderContext}

    Based on their mood, our perfumers have selected these fragrance notes from our collection:
    ${fragranceList}

    Create a custom perfume for this customer using ONLY these exact fragrances.

    Respond with this exact JSON structure:
    {
    "perfumeName": "A creative 2-3 word perfume name that captures the mood",
    "scentDescription": "A rich 3-4 sentence description of how this blend smells, how it makes you feel, and when to wear it. Be poetic and sensory."
    }`

        // ── STEP 8: Call Puter for AI generation ──────────────
        // This is where Puter does its job — "Generation" in RAG
        // We use the OpenAI SDK pointed at Puter's free endpoint
        // instead of OpenAI's paid servers
        const puterClient = new OpenAI({
        apiKey: process.env.PUTER_AUTH_TOKEN,
        baseURL: 'https://api.puter.com/puterai/openai/v1/',
        })

        const aiResponse = await puterClient.chat.completions.create({
        model: 'gpt-4o-mini',   // Puter supports this model for free
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt },
        ],
        temperature: 0.8,       // slightly creative but not too random
        max_tokens: 400,
        })

        // ── STEP 9: Parse Puter's response ────────────────────
        const rawText = aiResponse.choices[0].message.content.trim()

        let perfumeName, scentDescription

        try {
        // Strip any accidental markdown backticks if Puter added them
        const cleaned = rawText.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        perfumeName = parsed.perfumeName
        scentDescription = parsed.scentDescription
        } catch {
        // If JSON parsing fails, extract manually as a fallback
        // so we never return a 500 just because of formatting
        console.warn('Puter response was not clean JSON — extracting manually')
        perfumeName = 'Signature Blend'
        scentDescription = rawText
        }

        // ── STEP 10: Close the native MongoDB connection ───────
        // Always close the native client when done — unlike Mongoose,
        // MongoClient doesn't cache connections automatically
        await client.close()

        // ── STEP 11: Send the full response ───────────────────
        return NextResponse.json(
        {
            success: true,
            perfumeName,
            scentDescription,
            matchedFragrances,
            pricing: {
            fragranceCost: Number(fragranceCost.toFixed(2)),
            mixingFee,
            vialCost,
            totalAmount: Number(totalAmount.toFixed(2)),
            },
        },
        { status: 200 }
        )

    } catch (error) {
        // Make sure we close the native client even if something crashes
        if (client) await client.close()

        console.error('POST /api/ai/describe-match error:', error)
        return NextResponse.json(
        {
            success: false,
            message: 'Something went wrong with the AI matching',
            error: error.message,
        },
        { status: 500 }
        )
    }
}