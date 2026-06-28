import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(order) {
    if (!order.customer.email) {
        console.log('No customer email provided — skipping confirmation email')
        return
    }

    const fragranceList = order.notes
        .map(note => `${note.emoji} ${note.name}${note.role ? ` (${note.role})` : ''}`)
        .join(', ')

    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1714; color: #f5efe6; border-radius: 12px;">
        <h2 style="color: #c9a84c; font-weight: 300;">✦ Aura Luxe</h2>
        <p>Hi ${order.customer.name},</p>
        <p>Your order has been placed successfully! 🎉</p>
        <div style="background: #2a2520; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Order ID:</strong> ${order.orderId}</p>
            <p style="margin: 4px 0;"><strong>Fragrances:</strong> ${fragranceList}</p>
            <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${order.customer.address}</p>
            <p style="margin: 4px 0;"><strong>Total:</strong> ₦${order.totalAmount.toFixed(2)}</p>
            <p style="margin: 4px 0;"><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
        </div>
        <p>We'll notify you as your order progresses. Thank you for choosing Aura Luxe!</p>
        </div>
    `

    // Resend's HTTP API call — no SMTP, no App Password, no login handshake at all
    const { data, error } = await resend.emails.send({
        from: 'Aura Luxe <onboarding@resend.dev>', // ← swap once your boss verifies a real domain
        to: order.customer.email,
        subject: `Order Confirmed — ${order.orderId}`,
        html,
    })

    if (error) {
        console.error('Resend failed to send email:', error)
        return
    }

    console.log(`✅ Confirmation email sent to ${order.customer.email} — id: ${data.id}`)
}

export async function sendPaymentConfirmedEmail(order) {

    if (!order.customer.email) return

    const html = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #1a1714; color: #f5efe6; border-radius: 12px;">
        <h2 style="color: #c9a84c; font-weight: 300;">✦ Aura Luxe</h2>
        <p>Hi ${order.customer.name},</p>
        <p>Your payment for order <strong>${order.orderId}</strong> has been confirmed! ✅</p>
        <div style="background: #2a2520; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₦${order.totalAmount.toFixed(2)}</p>
            <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${order.customer.address}</p>
        </div>
        <p>We're preparing your order now. Thank you for choosing Aura Luxe!</p>
        </div>
    `

    const { data, error } = await resend.emails.send({
        from: 'Aura Luxe <onboarding@resend.dev>',
        to: order.customer.email,
        subject: `Payment Confirmed — ${order.orderId}`,
        html,
    })

    if (error) {
        console.error('Resend failed to send payment confirmation email:', error)
        return
    }
    console.log(`✅ Payment confirmation email sent to ${order.customer.email} — id: ${data.id}`)
    }