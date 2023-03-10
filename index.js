const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vh3xqbm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const foodCollection = client.db('foodsCorner').collection('foods');
        const foodReview = client.db('foodsCorner').collection('reviews');
        const blogCollection = client.db('foodsCorner').collection('blogs');

        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({}).sort({ "price": 1 });
            const foods = await cursor.toArray();
            res.send(foods);
        })

        app.get('/foods/:id', async (req, res) => {
            id = req.params.id;
            const food = await foodCollection.findOne({ _id: new ObjectId(id) });
            res.send(food);
        })

        app.get('/foodsLimit', async (req, res) => {
            const cursor = foodCollection.find({});
            const foodsLimit = await cursor.limit(5).toArray();
            res.send(foodsLimit);
        })

        app.get('/reviews/:id', async (req,res) => {
            id = req.params.id;
            const reviews = await foodReview.find({id: id}).toArray();
            res.send(reviews);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const reviews = await foodReview.insertOne(review);
            res.send(reviews);
        })

        app.get('/reviewer', async(req, res)=>{
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = foodReview.find(query).sort( { "userrating": 1 } );
            const review = await cursor.toArray();
            res.send(review);
        })

        app.delete('/reviewer/:id', async (req, res) => {
            const id = req.params.id;
            const result = await foodReview.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        })

        app.get('/blogs', async (req, res) => {
            const cursor = blogCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        })

    }
    finally {

    }
}

run().catch(e => console.error(e));

app.get('/', (req, res) => {
    res.send('food corner server is running')
})


app.listen(port, () => {
    console.log(`food corner server running on ${port}`);
})