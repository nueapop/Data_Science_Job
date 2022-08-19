const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const uri = 'mongodb://localhost:27017/?authMechanism=DEFAULT&authSource=miniproject';
const connectDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send(`Hello World! Let\'s Working with NoSQL Databases.`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});