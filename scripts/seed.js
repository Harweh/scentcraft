// Load environment variables from .env.local manually
// Next.js does this automatically — plain Node scripts don't
require('dotenv').config({ path: '.env.local' })

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

// ── THE 12 STARTER FRAGRANCES ──────────────────────────
// Matches the PRD catalog exactly: name, category, description,
// duration, price per ml, bottle color, and emoji.
// We set inStock, createdAt, updatedAt manually since we're
// bypassing the Mongoose model (which normally sets these for us)
const fragrances = [
  {
    name: 'Bulgarian Rose',
    category: 'Floral',
    description: 'A pure, focused floral heart with rich, romantic depth. Velvety rose petals with a whisper of honeyed sweetness.',
    duration: 'Long',
    pricePerMl: 3.50,
    color: '#e8a0b0',
    emoji: '🌹',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sandalwood',
    category: 'Woody',
    description: 'Warm, creamy, and grounding. A timeless woody base that lingers like sun-warmed timber.',
    duration: 'Long',
    pricePerMl: 2.80,
    color: '#a67c52',
    emoji: '🪵',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Bergamot',
    category: 'Citrus',
    description: 'Bright and zesty with a sparkling citrus snap. Energizing and fresh, like sunlight through orchard leaves.',
    duration: 'Short',
    pricePerMl: 2.20,
    color: '#f4d35e',
    emoji: '🍋',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Vanilla Absolute',
    category: 'Oriental',
    description: 'Rich, creamy sweetness with a soft powdery finish. Comforting and addictive, like warm dessert on a cold evening.',
    duration: 'Long',
    pricePerMl: 2.50,
    color: '#f3e5d8',
    emoji: '🍦',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Ocean Breeze',
    category: 'Fresh',
    description: 'Crisp and airy, evoking salt-kissed wind and open water. Clean and invigorating.',
    duration: 'Medium',
    pricePerMl: 2.00,
    color: '#8ecae6',
    emoji: '🌊',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Amber Resin',
    category: 'Oriental',
    description: 'Deep, golden, and resinous with a warm glow. Sensual and enveloping, like firelight at dusk.',
    duration: 'Long',
    pricePerMl: 3.00,
    color: '#d98324',
    emoji: '🧡',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Jasmine Sambac',
    category: 'Floral',
    description: 'Intoxicating white floral with a heady, narcotic sweetness. Lush and feminine, blooming under a night sky.',
    duration: 'Medium',
    pricePerMl: 3.20,
    color: '#f7cad0',
    emoji: '🌼',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Patchouli',
    category: 'Woody',
    description: 'Earthy and dark with a hint of camphor. Mysterious and grounding, like damp forest soil after rain.',
    duration: 'Long',
    pricePerMl: 2.60,
    color: '#6b4423',
    emoji: '🍂',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Lavender Fields',
    category: 'Fresh',
    description: 'Soft herbal florals with a calming, soapy clean edge. Soothing and gentle, like a summer field at golden hour.',
    duration: 'Medium',
    pricePerMl: 2.10,
    color: '#b39ddb',
    emoji: '💜',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Pink Grapefruit',
    category: 'Citrus',
    description: 'Tart and juicy with a sparkling pink fizz. Playful and refreshing, like biting into ripe fruit.',
    duration: 'Short',
    pricePerMl: 2.30,
    color: '#ff9a76',
    emoji: '🍊',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Cedarwood',
    category: 'Woody',
    description: 'Dry, pencil-shaving woodiness with a smooth, comforting finish. Sturdy and quietly confident.',
    duration: 'Long',
    pricePerMl: 2.40,
    color: '#4a5a3a',
    emoji: '🌲',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Pink Pepper',
    category: 'Oriental',
    description: 'Spicy and effervescent with a rosy pink sparkle. Lively and unexpected, adding a tingling kick.',
    duration: 'Short',
    pricePerMl: 2.70,
    color: '#c1666b',
    emoji: '🌶️',
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// ── THE SEED FUNCTION ───────────────────────────────────
async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected')

    // Talk directly to the raw 'fragrances' collection
    // (Mongoose auto-names collections as the lowercase plural
    // of the model name — 'Fragrance' model → 'fragrances' collection)
    const collection = mongoose.connection.db.collection('fragrances')

    // Wipe existing fragrances first so re-running this script
    // doesn't create duplicates every time
    console.log('🗑️  Clearing existing fragrances...')
    await collection.deleteMany({})

    // Insert all 12 in one batch operation — much faster than
    // inserting one at a time
    console.log('🌱 Seeding fragrances...')
    const result = await collection.insertMany(fragrances)
    console.log(`✅ ${result.insertedCount} fragrances seeded successfully!`)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    // Always close the connection when done —
    // otherwise the script hangs and never exits
    await mongoose.connection.close()
    console.log('🔌 Connection closed')
    process.exit(0)
  }
}

seed()