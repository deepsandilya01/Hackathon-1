import dotenv from "dotenv";
dotenv.config();

if(!process.env.PORT){
    throw new Error("PORT is not defined in environment variables")
}

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables")
}

if(!process.env.RESEND_API_KEY){
    throw new Error("RESEND_API_KEY is not defined in environment variables")
}

export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FRONTEND_URLS: process.env.FRONTEND_URLS || "http://localhost:5173",
    FRONTEND_URL: (process.env.FRONTEND_URL || process.env.FRONTEND_URLS?.split(",")[0] || "http://localhost:5173").trim(),
    API_PUBLIC_URL: process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT}`,
}   
