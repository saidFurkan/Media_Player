const express = require('express');
const mongoose = require('mongoose');
var cors = require("cors");

const app = express();
const PORT = 8000;
const url = 'mongodb://localhost/User';

 
var corsOptions = {
     origin: '*',
     optionsSuccessStatus: 200
};
 
app.use(express.json());

app.use(cors(corsOptions));


// connect db
mongoose.connect(url, {useNewUrlParser:true});
const con = mongoose.connection;

con.on('open', () => {    console.log('connected...');	})
con.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Set routes
const downloadRouter = require('./routes/downloadRoute');
const userRouter = require('./routes/userRoute');

app.use('/download',downloadRouter);
app.use('/user', userRouter);





app.listen(PORT, () => {
	console.log(`Server Works !!! At port ${PORT}`);
});