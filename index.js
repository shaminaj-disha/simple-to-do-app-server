const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ngf1b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemsCollection = client.db("carWarhouse").collection("tasks");

        // items api
        // get items
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // update item
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            // const updatedItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedData = {
                $set: {
                    status: 'complete'
                }
            };
            const result = await itemsCollection.updateOne(filter, updatedData, options);
            res.send(result);
        });

        // // get item by id
        // app.get('/items/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const item = await itemsCollection.findOne(query);
        //     res.send(item);
        // });

        // update item
        // app.put('/items/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedItem = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedData = {
        //         $set: {
        //             quantity: updatedItem.quantity
        //         }
        //     };
        //     const result = await itemsCollection.updateOne(filter, updatedData, options);
        //     res.send(result);
        // });

        // get user added item
        app.get('/addTask', async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = { email: email };
            const cursor = itemsCollection.find(query);
            const userAddedItems = await cursor.toArray();
            res.send(userAddedItems);
        });

        // add item
        app.post('/addTask', async (req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        // delete item
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log('Listening to port, ', port);
})