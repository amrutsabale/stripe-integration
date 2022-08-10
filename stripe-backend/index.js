require("dotenv").config();
const cors = require("cors");
const express = require("express");

// Stripe Secret key
const stripe = require("stripe")(process.env.STRIPE_SECRETE_KEY);
const { v4: uuid } = require("uuid");
const app = express();

// middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// routes
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Direct payment via Client
app.post("/payment", (req, res) => {
  const { product, token } = req.body;

  //to prevent user from charging again
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100, //cents->dollar
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.error(err));
});

// Payment via Stripe Checkout page
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "React ZTH Course",
            },
            unit_amount: 10000,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment via Stripe Checkout page
app.post("/create-subscription-checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "price_1LVCHhSJ6M2qrXwJxkOFHiOd",
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// listen
app.listen(8282, () => console.log("Listening at port 8282..."));
