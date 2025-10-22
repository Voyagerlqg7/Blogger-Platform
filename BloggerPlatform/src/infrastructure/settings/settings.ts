export const settings = {
    NODE_ENV: process.env.NODE_ENV || "development",
    LOCAL_MONGODB_URI: process.env.LOCAL_MONGODB_URI || "mongodb://localhost:6420/loving_mongo",
    ATLAS_MONGO_URI: process.env.ATLAS_MONGO_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "something wrong with JWT_SECRET",
    GOOGLE_GMAIL_EMAIL: process.env.GOOGLE_GMAIL_EMAIL || "",
    GOOGLE_GMAIL_APP_PASSWORD: process.env.GOOGLE_GMAIL_APP_PASSWORD || "",
};