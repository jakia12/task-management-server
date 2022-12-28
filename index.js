const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//require mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//require cors 
const cors = require('cors');
// const { query } = require('express');

// body parser
app.use(express.json());

//cors
app.use(cors());

//require dotenv
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const taskCollections = client.db('task-manager').collection('tasks');

    //insert task data
    app.post('/tasks', async (req, res) => {
        const task = req.body;
        const result = await taskCollections.insertOne(task);
        res.send(result);
    });

}

run().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`server is running on  ${port}`)
});

