require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSuccessStatus: 200,
//   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
// };

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.apzeojt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();

const ToysCollection = client.db("ToysDB").collection("toys");

// query method
app.get("/toys/query", async (req, res) => {
  const query = { email: req.query.email };
  const cursor = ToysCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

// toys collection
app.post("/toys", async (req, res) => {
  const doc = req.body;
  const result = await ToysCollection.insertOne(doc);
  res.send(result);
});

// Get all the toys
app.get("/toys", async (req, res) => {
  const limit = 20;
  const cursor = ToysCollection.find().limit(limit);
  const result = await cursor.toArray();
  res.send(result);
});

// getting single toys
app.get("/toys/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await ToysCollection.findOne(query);
  res.send(result);
});

app.delete("/toys/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await ToysCollection.deleteOne(query);
  res.send(result);
});

app.patch("/toys/:id", async (req, res) => {
  const id = req.params.id;
  const updatetoys = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      name: updatetoys.name,
      category: updatetoys.category,
      price: updatetoys.price,
      quantity: updatetoys.quantity,
      description: updatetoys.description,
      rating: updatetoys.rating,
    },
  };
  const result = await ToysCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
