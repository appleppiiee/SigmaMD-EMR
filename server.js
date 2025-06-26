import config from './config/config.js' 
import app from './server/express.js'
import mongoose from 'mongoose' 
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUri, {
//useNewUrlParser: true,
//useCreateIndex: true, 
//useUnifiedTopology: true
 } )
 .then(() => {
     console.log("Connected to the database!");
     })
    
mongoose.connection.on('error', () => {
throw new Error(`unable to connect to database: ${config.mongoUri}`) 
})
app.get("/", (req, res) => {
res.json({ message: "Welcome to User application." });
});
app.listen(config.port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.info(`Server listening on http://0.0.0.0:${config.port}`);
});


