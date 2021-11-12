const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
//middlware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxyvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
      await client.connect();
      const database = client.db("CarSale");
      const ServiceCollection = database.collection("CarCollection");
      const OrderCollection = database.collection("order");
      const ReviwCollection = database.collection("Review");
       const userCollection = database.collection("users")
  //Post api
  app.post('/services',async(req,res) =>{
      const service = req.body;
      const result = await ServiceCollection.insertOne(service);
      console.log(result)
      res.json(result)
  })
  //Get APi
  app.get('/services', async(req,res) =>{
      const cursor = ServiceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
  })
  app.post('/addOrders',async(req,res) =>{
    const order = req.body;
    console.log(order);
    const orderResult = await OrderCollection.insertOne(order);
    console.log(orderResult)
    res.json(orderResult)
})
//myOrders Api
app.get('/myOrders/:email', async(req,res) =>{
  const myOrders = await OrderCollection.find({email: req.params.email}).toArray();
  res.send(myOrders);
  
})
app.get('/myOrders', async(req,res) =>{
  const myOrders = await OrderCollection.find({}).toArray();
  res.send(myOrders);
  
})
//post api reviews
app.post('/addreview',async(req,res) =>{
  const review = req.body;
  const result = await ReviwCollection.insertOne(review);
  console.log(result)
  res.json(result)
})
//Get APi reviews
app.get('/addreview', async(req,res) =>{
  const cursor = ReviwCollection.find({});
  const review = await cursor.toArray();
  res.send(review);
})

app.post('/users',async(req,res)=>{
  const user = req.body;
  const result = await userCollection.insertOne(user);
  console.log(result);
  res.json(result);
})
//delete api
app.delete('/myOrders/:id',async(req,res)=>{
  const id =req.params.id;
  const query = {_id:ObjectId};
  const result = await OrderCollection.deleteOne(query);
  res.json(result);
})
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello Niche Website Backend!')
})

app.listen(port, () => {
  console.log(`Listening From http://localhost:${port}`)
})