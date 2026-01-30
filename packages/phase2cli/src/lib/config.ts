/**
 * Production configuration for World ID Trusted Setup CLI.
 * These values are embedded so contributors can use the CLI without manual configuration.
 * Environment variables can override these defaults for development/testing.
 */

export const config = {
    // Firebase configuration
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "AIzaSyCAwTmxYJFZ96vPAX5YnrAN5xAmt84JdpE",
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "p0tion-dev.firebaseapp.com",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "p0tion-dev",
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || "812442773691",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "1:812442773691:web:30df156fdc25305475e19e",
    FIREBASE_CF_URL_VERIFY_CONTRIBUTION:
        process.env.FIREBASE_CF_URL_VERIFY_CONTRIBUTION || "https://verifycontribution-qjgth4d4nq-ew.a.run.app",

    // GitHub OAuth
    AUTH_GITHUB_CLIENT_ID: process.env.AUTH_GITHUB_CLIENT_ID || "Ov23lifTwN0L6vnIan2J",

    // S3/Storage configuration (with sensible defaults)
    CONFIG_STREAM_CHUNK_SIZE_IN_MB: Number(process.env.CONFIG_STREAM_CHUNK_SIZE_IN_MB) || 50,
    CONFIG_CEREMONY_BUCKET_POSTFIX: process.env.CONFIG_CEREMONY_BUCKET_POSTFIX || "-ph2-ceremony",
    CONFIG_PRESIGNED_URL_EXPIRATION_IN_SECONDS: Number(process.env.CONFIG_PRESIGNED_URL_EXPIRATION_IN_SECONDS) || 7200,

    // Bandada (optional)
    BANDADA_API_URL: process.env.BANDADA_API_URL || "",
    BANDADA_GROUP_ID: process.env.BANDADA_GROUP_ID || "",
    BANDADA_DASHBOARD_URL: process.env.BANDADA_DASHBOARD_URL || "",

    // SIWE (optional)
    AUTH_SIWE_CLIENT_ID: process.env.AUTH_SIWE_CLIENT_ID || "",
    AUTH0_APPLICATION_URL: process.env.AUTH0_APPLICATION_URL || "https://dev-l0tyk1agsmopw1xa.us.auth0.com"
}
