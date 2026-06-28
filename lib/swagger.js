import swaggerJSDoc from 'swagger-jsdoc'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'Aura Luxe API',
        version: '1.0.0',
        description: 'Custom perfume e-commerce API — catalog, orders, AI scent matching, and payments.',
        },
        servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server',
        },
        ],
    },
    // Scans every file matching this pattern for @swagger comments
    apis: ['./app/api/**/*.js'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec