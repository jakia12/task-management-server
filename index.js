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
    const commentCollection = client.db('task-manager').collection('comments');

    //insert task data
    app.post('/tasks', async (req, res) => {
        const task = req.body;
        const result = await taskCollections.insertOne(task);
        res.send(result);
    });

    //get all the tasks 
    app.get('/tasks', async (req, res) => {
        const userEmail = req.query.userEmail;
        // const isCompleted = req.query.isCompleted;
        let query = {};

        if (userEmail) {
            query = {
                userEmail: userEmail,

            }
        }
        // else if (isCompleted) {
        //     query = {
        //         isCompleted: isCompleted
        //     }
        // }

        const cursor = taskCollections.find(query);
        const tasks = await cursor.sort({
            postDate: -1
        }).toArray();
        res.send(tasks);
    });

    //complete the task 
    app.put('/tasks/completed/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                isCompleted: true
            }
        };

        const result = await taskCollections.updateOne(filter, updatedDoc, options);

        res.send(result);

    });

    //uncomplete the task
    app.put('/tasks/notCompleted/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
            $unset: {
                isCompleted: ""
            }
        };
        const result = await taskCollections.updateOne(filter, updatedDoc, options);
        res.send(result);
    });

    //get single task 

    app.get('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const task = await taskCollections.findOne(query);
        res.send(task);
    });

    //update the single task
    app.put('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const option = { upsert: true };
        const task = req.body;
        console.log(task);
        const updatedDoc = {
            $set: {
                title: task.title
            }
        };

        const result = await taskCollections.updateOne(filter, updatedDoc, option);
        console.log(result);
        res.send(result);
    });

    //delete single task
    app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const task = await taskCollections.deleteOne(query);
        res.send(task);
    });

    //get a single completed task
    app.get('/tasks/completed/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const task = await taskCollections.findOne(query);
        res.send(task);
    });

    //insert comment data
    app.post('/comments', async (req, res) => {
        const comment = req.body;
        const result = await commentCollection.insertOne(comment);
        res.send(result);
    });

    app.get('/comments', async (req, res) => {
        const commentId = req.query.commentId;
        let query = {};

        if (commentId) {
            query = {
                commentId: commentId
            }
        };

        const comments = await commentCollection.find(query).sort({ commentDate: -1 }).toArray();

        res.send(comments);

    });
}

run().catch(err => console.log(err));

app.listen(port, () => {
    console.log(`server is running on  ${port}`)
});

