const config = {
    env: process.env.NODE_ENV || 'development', 
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key", 
    mongoUri: process.env.MONGODB_URI || "mongodb+srv://sigmaMD:sigmaSigma@sigmamd.hyfld.mongodb.net/SigmaMD?retryWrites=true&w=majority&appName=SigmaMD"
 
    }
    export default config
