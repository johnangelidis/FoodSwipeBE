const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => {
    console.log("MongoDB connection established successfully");
});


app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on Port: " + PORT);
});