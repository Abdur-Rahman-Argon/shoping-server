const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// var ObjectId = require("mongodb").ObjectID;
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(
  "sk_test_51LTEuNIgycd7Qr94MKHjgOFUqlEJYBp0CrW78kIN7h0YjZX532tbl8PfbW8ar6PVNTC23mtXwhJ1LMjjXTqTyWeE00s7lYdYp9"
);
// shoping - point;

app.use(cors());
app.use(express.json());

//------------(MongoDB)---------------------------------------------------------------
const uri =
  "mongodb+srv://shoping-point:nnP4cSflwEa07Sg9@cluster0.y4iwu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect;

    //All product collection here
    const productCollection = client
      .db("product-collection")
      .collection("allProduct");

    //Cart collection here
    const cartCollection = client.db("product-collection").collection("cart");

    //order collection
    const myOrderCollection = client
      .db("order-collection")
      .collection("myOrder");

    //review collection
    const publicReviewCollection = client
      .db("review-collection")
      .collection("publicReview");

    //user collection
    const userCollection = client.db("user-collection").collection("userList");

    //------------(AllProduct Section Start)-------------------------------------------------------

    // all product get api
    app.get("/allProducts", async (req, res, next) => {
      const query = {};
      const cursor = await productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // one product get api
    app.get("/allProduct/:productId", async (req, res) => {
      const id = req.params.productId;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    //-------------------------------------------------------------------

    // user create and update api
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // Get secret Pin () / JWT token
      const token = jwt.sign({ email: email }, "secret", { expiresIn: "5d" });

      res.send({ success: true, result, accessToken: token });
    });

    // single user update api
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send({ result });
    });

    // user get by email
    app.get("/user/:userEmail", async (req, res) => {
      const userEmail = req.params.userEmail;
      const query = { email: userEmail };
      const cursor = await userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = await userCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //-------------------------------------------------

    //
  } finally {
    // await client.close();
  }
}
run().catch(console.dir()); // Call Function

// test Server and Working
app.get("/", (req, res, next) => {
  res.send("This is server is running");
});

// local server running in port 5000
app.listen(port, () => {
  console.log("server running port", port);
});

// const myOrder = [
//   {
//     customerName: "",
//     customerEmail: "",
//     phoneNumber: "",
//     shippingAddress: "",
//     orderPlacedDate: "",
//     ProductInfo: {
//       productID: "",
//       productTitle: "Samsung A10",
//       price: 12990,
//       discount: "20",
//       image: "pjoneimag.png",
//       brandName: "Samsung",
//       category: "phone",
//       stock: 120,
//     },
//     paymentInfo: {
//       paymentDate: "",
//       trxID: "",
//       PaymentType: "",
//     },

//     paymentStatus: "paid",
//     orderCancel: "Canceled",
//     deliveryStatus: "delivered",
//     deliveryConfirmDate: "",
//     expectDeliveryDate: "",
//     packing: "",
//     Courier: "",
//   },
// ];
