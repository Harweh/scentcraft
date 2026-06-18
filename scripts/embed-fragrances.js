import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import Fragrance from '../models/Fragrance.js'
import embeddings from '../lib/embeddings.js'

const MONGODB_URI = process.env.MONGODB_URI

async function embedFragrances() {
  try {
    // Step 1: Connect to MongoDB directly (same pattern as our seed script)
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Step 2: Get every fragrance currently in the database
    const fragrances = await Fragrance.find({})
    console.log(`Found ${fragrances.length} fragrances to embed`)

    // Step 3: Build the text we actually want to embed for each fragrance
    // We combine name + category + description + duration into one string
    // Why combine all of these? Because a customer might say something
    // that maps to the CATEGORY ("something fresh") rather than exact
    // wording in the description — feeding the model more context
    // makes the matching smarter
    const texts = fragrances.map(f =>
      `${f.name}. Category: ${f.category}. ${f.description} Duration: ${f.duration}.`
    )

    // Step 4: Generate all embeddings in ONE batch call
    // embedDocuments() is built for exactly this — multiple texts at once,
    // more efficient than calling embedQuery() in a loop 12 separate times
    console.log('Generating embeddings for all fragrances...')
    const vectors = await embeddings.embedDocuments(texts)

    // Step 5: Save each vector back onto its matching fragrance document
    for (let i = 0; i < fragrances.length; i++) {
      fragrances[i].embedding = vectors[i]
      await fragrances[i].save()
      console.log(`✅ Embedded: ${fragrances[i].name}`)
    }

    console.log(`🎉 Successfully embedded ${fragrances.length} fragrances`)

    await mongoose.connection.close()
    process.exit(0)

  } catch (error) {
    console.error('❌ Embedding failed:', error)
    process.exit(1)
  }
}

embedFragrances()