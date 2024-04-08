const configSwagger = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "team",
            version: "v0.0.1",
            description: "the backend of team"
        },
        servers: [{ url: `http://localhost:${process.env.PORT}` }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [{ BearerAuth: [] }],
    },
    apis: ['src/modules/**/**/*.js', 'src/app/**/*.js']
};

module.exports = configSwagger;