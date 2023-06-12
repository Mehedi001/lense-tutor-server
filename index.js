
const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkb4jt3.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //    client.connect();

        const userCollection = client.db('lenseTutorDB').collection('user')
        const classesCollection = client.db('lenseTutorDB').collection('classes')



        app.get('/users', async (req, res) => {
            const role = req.query.role;
            const query = {role:{ $regex: role, $options: 'i'}};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result)
        })

        app.get('/usermail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await classesCollection.find(query).toArray();
            res.send(result)
        })


        // send user data to mongodb 
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })
        // send class data to mongodb 
        app.post('/classes', async (req, res) => {
            const newClass = req.body;
            const result = await classesCollection.insertOne(newClass);
            res.send(result);
        })

         // update data

         app.put('/class/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedClass = req.body;
            const classes = {
                $set: {
                    name: updatedClass.name,
                    price: updatedClass.price,
                    description: updatedClass.description,
                }
            }
            const result = await classesCollection.updateOne(filter, classes, options);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('lense Tutor Server is Running')
})

app.listen(port, () => {
    console.log(`lense tutor Running on: ${port}`)
})