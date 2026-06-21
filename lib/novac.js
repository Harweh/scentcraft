const NOVAC_SECRET_KEY = process.env.NOVAC_SECRET_KEY
const NOVAC_BASE_URL = 'https://api.novacpayment.com'

export const NOVAC_CURRENCY = 'NGN'

export async function initializeNovacPayment({
    email, firstName, lastName, phoneNumber, amount, reference, redirectUrl, description,
    }) {
    const response = await fetch(`${NOVAC_BASE_URL}/api/v1/initiate`, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${NOVAC_SECRET_KEY}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        transactionReference: reference, // must be 16-50 characters — our ORD-{timestamp} is 17, safe
        amount,
        currency: NOVAC_CURRENCY,
        redirectUrl,
        checkoutCustomerData: { email, firstName, lastName, phoneNumber },
        checkoutCustomizationData: { paymentDescription: description },
        }),
    })

    return response.json()
    }

    export async function verifyNovacPayment(transactionReference) {
    const response = await fetch(
        `${NOVAC_BASE_URL}/api/v1/checkout/${transactionReference}/verify`,
        {
        method: 'GET',
        headers: { Authorization: `Bearer ${NOVAC_SECRET_KEY}` },
        }
    )

    return response.json()
}