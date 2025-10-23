import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './Routes/routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  credentials: true
}));


app.use('/', router);

mongoose.connect(
    process.env.MONGODB,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    }
).then( () => {
  console.log('MongoDB connected succesfully');
  
  const Port = process.env.PORT || 8000;
  app.listen(Port, () => {
    console.log(`Server started at port: ${Port}`);
  })
})
.catch((err) => console.log('error', err.message))