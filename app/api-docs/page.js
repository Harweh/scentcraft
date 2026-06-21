'use client'

import 'swagger-ui-react/swagger-ui.css'
import dynamic from 'next/dynamic'

// swagger-ui-react needs the browser (uses window) — { ssr: false }
// tells Next.js to only load this client-side, never on the server
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
        <SwaggerUI url="/api/docs" />
        </div>
    )
}