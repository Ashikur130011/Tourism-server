const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
var cors = require("cors");

const app = express()
const port = process.env.PORT || 5000

const ObjectId = require("mongodb").ObjectId;

//Middleware
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv45h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try{
        await client.connect();
        const database = client.db('The-Travel');
        const packageCollection = database.collection('package');

        //GET API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        //GET SINGLE API
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const package = await packageCollection.findOne(query);
            res.send(package)
        })

        //POST API
        app.post('/package', async(req, res)=> {
            const service = req.body;
            const result = await packageCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        //DELETE API
        app.delete('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query= {_id: ObjectId(id)};
            const result = await packageCollection.findOne(query);
            res.json(query)
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})