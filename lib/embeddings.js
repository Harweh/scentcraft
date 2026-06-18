// import { OpenAIEmbeddings } from '@langchain/openai'

// const embeddings = new OpenAIEmbeddings({
//   apiKey: process.env.PUTER_AUTH_TOKEN,
//   model: 'text-embedding-3-small',
//   configuration: {
//     baseURL: 'https://api.puter.com/puterai/openai/v1/',
//   },
// })

// export default embeddings


// import { OpenAIEmbeddings } from '@langchain/openai'

// This creates ONE reusable embeddings model instance
// "text-embedding-3-small" is OpenAI's cheapest, fastest embedding model
// It converts any text into a list of 1536 numbers (a "vector")
// Two pieces of text that MEAN similar things end up with similar numbers
// e.g. "warm and cozy" and "Sandalwood, Amber Resin" would land close together
// even though they don't share a single word in common
// const embeddings = new OpenAIEmbeddings({
//   apiKey: process.env.OPENAI_API_KEY,
//   model: 'text-embedding-3-small',
// })

// export default embeddings



// export const runtime = 'nodejs'


// cat > lib/embeddings.js << 'EOF'
import { pipeline } from '@huggingface/transformers'
import { Embeddings } from '@langchain/core/embeddings'

let extractorPromise = null

function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractorPromise
}

class LocalEmbeddings extends Embeddings {
  constructor() {
    super({})
  }

  async embedQuery(text) {
    const extractor = await getExtractor()
    const output = await extractor(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data)
  }

  async embedDocuments(texts) {
    const extractor = await getExtractor()
    const output = await extractor(texts, { pooling: 'mean', normalize: true })
    return output.tolist()
  }
}

const embeddings = new LocalEmbeddings()
export default embeddings
// EOF