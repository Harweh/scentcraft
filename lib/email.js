import nodemailer from 'nodemailer'

// This creates ONE reusable email "transporter" — the object
// that actually knows how to log into Gmail and send mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Builds and sends the order confirmation email
// Called right after an order is successfully saved to MongoDB
export async function sendOrderConfirmationEmail(order) {
  // If the customer didn't provide an email, just skip silently —
  // email is optional in our Order model, COD customers may not give one
    if (!order.customer.email) {
        console.log('No customer email provided — skipping confirmation email')
        return
    }

    // Build a simple, readable list of fragrances for the email body
    const fragranceList = order.notes
        .map(note => `${note.emoji} ${note.name}${note.role ? ` (${note.role})` : ''}`)
        .join(', ')

    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1714; color: #f5efe6; border-radius: 12px;">
        <h2 style="color: #c9a84c; font-weight: 300;">✦ ScentCraft</h2>
        <p>Hi ${order.customer.name},</p>
        <p>Your order has been placed successfully! 🎉</p>

        <div style="background: #2a2520; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
            <p style="margin: 4px 0;"><strong>Fragrances:</strong> ${fragranceList}</p>
            <p style="margin: 4px 0;"><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p style="margin: 4px 0;"><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
        </div>

        <p>We'll notify you as your order progresses. Thank you for choosing ScentCraft!</p>
        </div>
    `

    // sendMail() actually dispatches the email through Gmail's servers
    await transporter.sendMail({
        from: `"ScentCraft" <${process.env.EMAIL_USER}>`,
        to: order.customer.email,
        subject: `Order Confirmed — ${order.orderId}`,
        html,
    })

    console.log(`✅ Confirmation email sent to ${order.customer.email}`)
}