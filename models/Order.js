import mongoose from 'mongoose'

// ── SUB-SCHEMA: Selected Note ──────────────────────────
// This defines the shape of EACH fragrance inside an order
// It's a sub-schema meaning it lives nested inside the Order,
// not as its own separate MongoDB collection
const SelectedNoteSchema = new mongoose.Schema( 
    {
      fragranceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fragrance',
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      emoji: {
        type: String,
        default: '🌿',
      },

      role: {
        type: String,
        // required: true,
        enum: ['Base', 'Heart', 'Top'],
        default: null,
      },

      pricePerMl: {
        type: Number,
        required: true,
      },

      mlUsed: {
        type: Number,
        default: 2,
      },

  }
)


// ── MAIN SCHEMA: Order ────────────────────────────────
const OrderSchema = new mongoose.Schema(
  {
    // Auto-generated readable order ID shown to customers
    // e.g. ORD-1718204580000 — matches exactly what PRD shows
    orderId: {
      type: String,
      required: true,
      unique: true, // no two orders can share the same ID
    },

    purchaseType: {
      type: String,
      required: true,
      enum: ['as_is', 'manual_mix', 'ai_match'],
      // as_is      = buying 1-2 existing fragrances directly, no mixing
      // manual_mix = customer picked 2-3 notes themselves (Customizer page)
      // ai_match   = customer described a mood, AI matched and blended it
    },

    deliveryZone: {
      type: String,
      required: true,
      enum: ['local', 'national', 'international'],
    },


    // notes: {
    //   type: [SelectedNoteSchema],
    //   validate: {
    //     validator: function (notes) {
    //       return notes.length >= 1 && notes.length <= 3
    //     },
    //     message: 'An order must have between 1 and 3 fragrance notes',
    //   },
    // },

    notes: {
      type: [SelectedNoteSchema],
      validate: {
        validator: function (notes) {
          if (this.purchaseType === 'as_is') {
            return notes.length >= 1 && notes.length <= 2
            // as-is purchases: max 2 fragrances, matches PRD scope
          }
          return notes.length >= 1 && notes.length <= 3
          // mix/ai_match: up to 3 notes (Base/Heart/Top)
        },
      message: 'Invalid number of fragrances for this purchase type',
      },
    },

    scentDescription: {
      type: String,
      default: '',
    },

    // ── PRICING BREAKDOWN ──────────────────────────────
    // Each cost is stored separately so we can display
    // the full breakdown on the orders page (just like PRD shows)

    fragranceCost: {
      type: Number,
      required: true,
      // Total cost of all fragrance notes combined
      // e.g. Rose $7.00 + Sandalwood $5.60 + Vanilla $5.00 = $17.60
    },

    mixingFee: {
      type: Number,
      default: 15.00,
      // Flat fee — covers labor and equipment as per PRD business model
    },

    vialCost: {
      type: Number,
      default: 5.00,
      // The 2ml sample vial — materials and packaging
    },

    deliveryFee: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      // fragranceCost + mixingFee + vialCost
      // e.g. $17.60 + $15.00 + $5.00 = $37.60 (matches PRD exactly)
    },

    // ── CUSTOMER DETAILS ───────────────────────────────
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        default: '',
        // Optional — used if customer wants email confirmation
      },
    },

    // ── PAYMENT ────────────────────────────────────────
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'online'],
      // cod    = Cash on Delivery (pay the courier when it arrives)
      // online = Paystack payment link
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      // pending → order placed but not paid yet (always starts here)
      // paid    → Paystack confirmed payment OR cod order delivered
      // failed  → Paystack payment failed
    },

    // Paystack returns a reference string when payment is initiated
    // We store it so we can verify the payment in our /api/payment/verify route
    // paystackReference: {
    //   type: String,
    //   default: '',
    // },

    // for novac
      paymentReference: {
      type: String,
      default: '',
    },



    // ── ORDER STATUS ───────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },

  {
    timestamps: true,
    // Adds createdAt and updatedAt automatically
    // createdAt is what we show as the order date on the Orders page
  }
)

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)

export default Order