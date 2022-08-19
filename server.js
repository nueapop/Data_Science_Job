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

// Get all data from collection
app.get('/salaries', async (req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('miniproject').collection('salaries').find({}).sort({ 'work_year': -1 }).toArray();
    await client.close();
    res.status(200).send(objects);
});

// Get a data from collection by ID
app.get('/salaries/:id', async (req, res) => {
    const id = req.params.id;
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('miniproject').collection('salaries').findOne({
        "_id":
            ObjectId(id)
    });
    await client.close();
    res.status(200).send(objects);
});

// Get a data from collection by Text
app.get('/salaries/job_title/:searchText', async (req, res) => {
    const { params } = req;
    const searchText = params.searchText;
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('miniproject').collection('salaries').find({
        $text: {
            $search: searchText
        }
    }).sort({ "work_year": -1 }).toArray();
    await client.close();
    res.status(200).send({
        'status': 200,
        'searchText': searchText,
        'salaries': objects
    });
});

// Create a new data from collection
app.post('/salaries/create', async (req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('miniproject').collection('salaries').insertOne({
        work_year: object.work_year,
        experience_level: object.experience_level,
        employment_type: object.employment_type,
        job_title: object.job_title,
        salary: object.salary,
        salary_currency: object.salary_currency,
        salary_in_usd: object.salary_in_usd,
        employee_residence: object.employee_residence,
        remote_ratio: object.remote_ratio,
        company_location: object.company_location,
        company_size: object.company_size
    });
    await client.close();
    res.status(200).send({
        'status': 200,
        'message': 'Object is created',
        'object': object
    });
});

// Update a data from collection
app.put('/salaries/update', async (req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('miniproject').collection('salaries').updateOne({
        '_id': ObjectId(id)
    }, {
        "$set": {
            work_year: object.work_year,
            experience_level: object.experience_level,
            employment_type: object.employment_type,
            job_title: object.job_title,
            salary: object.salary,
            salary_currency: object.salary_currency,
            salary_in_usd: object.salary_in_usd,
            employee_residence: object.employee_residence,
            remote_ratio: object.remote_ratio,
            company_location: object.company_location,
            company_size: object.company_size
        }
    });
    await client.close();
    res.status(200).send({
        'status': 200,
        'message': 'Object with ID = ' + id + ' is updated',
        'object': object
    });
});

// Delete a data from collection
app.delete('/salaries/delete', async (req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('miniproject').collection('salaries').deleteOne({ '_id': ObjectId(id) });
    await client.close();
    res.status(200).send({
        'status': 200,
        'message': 'Object with ID = ' + id + ' is deleted'
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});