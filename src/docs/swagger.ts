import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API ACARA",
        description: "Dokumentasi API ACARA"
    },
    servers: [
        {
        url: "http://localhost:4000/api",
        description: "Local Server"
    },
    {
        url: "https://back-end-acara-gilt.vercel.app/api",
        description: "Deploy Server"
    }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            }
        },
        schemas: {
            LoginRequest: {
                identifier: "misonomika",
                password: "12341234"
            }
        }
    }
}

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc)