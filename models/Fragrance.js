import mongoose from 'mongoose'


const FragranceSchema = new mongoose.Schema(
  {
    name: {
      type: String,       
      required: true,     
      trim: true,     
    },

    category: {
      type: String,
      required: true,
      enum: ['Floral', 'Woody', 'Fresh', 'Oriental', 'Citrus'],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      enum: ['Short', 'Medium', 'Long'],
    },

    pricePerMl: {
      type: Number,
      required: true,
      min: 0,           
    },

    color: {
      type: String,
      required: true,
      default: '#c4a882', 
    },

    emoji: {
      type: String,
      default: '🌿',  
    },

    inStock: {
      type: Boolean,
      default: true,     
    },
    
    embedding: {
      type: [Number],
      default: [],
    }
  },

  {

    timestamps: true,
  }
)

const Fragrance = mongoose.models.Fragrance || mongoose.model('Fragrance', FragranceSchema)

export default Fragrance