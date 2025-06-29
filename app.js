const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./Routes/routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


app.use('/', router);

mongoose.connect(
    process.env.MONGODB,
    { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    }
).then( () => console.log('MongoDB connected succesfully'))
.catch((err) => console.log('error', err.message))

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
    console.log(`Server started at port: ${Port}`);
})