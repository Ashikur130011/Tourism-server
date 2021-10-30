const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

require('dotenv').config();
var cors = require("cors");

const app = express()
const port = process.env.PORT || 5000

//Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv45h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try{
        await client.connect();
        const database = client.db('The-Travel');
        const packageCollection = database.collection('package');
        const bookingCollection = database.collection('booking')
        console.log('database connected');

        //GET PACKAGE API
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

        //POST PACKAGE API
        app.post('/package', async(req, res)=> {
            const service = req.body;
            const result = await packageCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        //POST BOOKING API
        app.post('/booking', async (req, res)=> {
            const cursor = req.body;
            const result = await bookingCollection.insertOne(cursor)
            console.log(result);
            res.json(result)

        })
        //GET BOOKING API
        app.get('/booking', async(req, res) => {
            const booking=await bookingCollection.find({}).toArray();
            res.json(booking)
        })

        // GET BOOKING API BY QUERY
        app.get('/booking/:email', async(req, res) =>{
            const email = req.params.email;
            const  query = {Email: email}
            const booking = await bookingCollection.find(query).toArray();
            res.json(booking)
        })

        //DELETE BOOKING API
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const booking = await bookingCollection.findOne(query).toArray();
            res.json(booking)
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