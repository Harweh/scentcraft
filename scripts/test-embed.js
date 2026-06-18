// import dotenv from 'dotenv'
// dotenv.config({ path: '.env.local' })

// import embeddings from '../lib/embeddings.js'

// console.log('Token loaded?', !!process.env.PUTER_AUTH_TOKEN)

// async function test() {
//   // embedQuery() turns a single string into its vector representation
//   const vector = await embeddings.embedQuery('warm, confident, like a fireplace in winter')

//   console.log('✅ Embedding generated successfully')
//   console.log('Vector length:', vector.length)
//   console.log('First 5 numbers:', vector.slice(0, 5))
// }

// test()




// cat > scripts/test-embed.js << 'EOF'
import embeddings from '../lib/embeddings.js'

async function test() {
  const vector = await embeddings.embedQuery(
    'warm, confident, like a fireplace in winter'
  )

  console.log('✅ Embedding generated successfully')
  console.log('Vector length:', vector.length)
  console.log('First 5 numbers:', vector.slice(0, 5))
}

test()
// EOF