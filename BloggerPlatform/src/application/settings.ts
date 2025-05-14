export const settings = {
    JWT_SECRET : process.env["JWT_SECRET "] || "something wrong with JWT_SECRET",
    MONGODB_URI : process.env["MONGODB_URI "] || "something wrong with MONGODB_URI"
};