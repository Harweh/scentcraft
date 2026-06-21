import mongoose from 'mongoose'

// One document per payment EVENT, not per order — so a single order
// can have multiple rows here (an initialize attempt, then a verify
// outcome) instead of overwriting one final state
const TransactionSchema = new mongoose.Schema(
    {
        order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        },
        orderId: {
        type: String,
        required: true,
        },
        reference: {
        type: String,
        required: true,
        },
        amount: {
        type: Number,
        required: true,
        },
        currency: {
        type: String,
        default: 'NGN',
        },
        status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        required: true,
        },
        source: {
        type: String,
        enum: ['initialize', 'verify', 'webhook'],
        required: true,
        // which part of our code created this row
        },
        gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        // the raw response Novac sent — kept for future accounting/disputes
        },
    },
    { timestamps: true }
)

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)
export default Transaction