export const settings = {
    JWT_SECRET : process.env["JWT_SECRET"] || "something wrong with JWT_SECRET",
    MONGODB_URI : process.env["MONGODB_URI"] || "something wrong with MONGODB_URI",
    GOOGLE_GMAIL_EMAIL: process.env["GOOGLE_GMAIL_EMAIL"] || "something wrong with GOOGLE_GMAIL_EMAIL",
    GOOGLE_GMAIL_APP_PASSWORD: process.env["GOOGLE_GMAIL_APP_PASSWORD"] || "something wrong with GOOGLE_GMAIL_PASSWORD",
};