import { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import "./App.css";

function App() {
  const [product, setProduct] = useState({
    name: "React Zero to Hero Course from Amrut",
    price: 10,
    productBy: "Amrut Software Inc.",
  });

  const makePayment = (token) => {
    const body = { token, product };
    const headers = { "Content-Type": "application/json" };

    return fetch(`http://localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("response", response);
      })
      .catch((err) => console.error(err));
  };

  const handleCheckout = () => {
    fetch("http://localhost:8282/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@gmail.com" }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  const handleSubscriptionCheckout = () => {
    fetch("http://localhost:8282/create-subscription-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@gmail.com" }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  return (
    <div className="App">
      <StripeCheckout
        stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
        token={makePayment}
        name="Buy AWS ZTM Course"
        amount={product.price * 100}
        // shippingAddress
        // billingAddress
      >
        Custom checkout page{" "}
        <button>Buy AWS ZTM Course Just for ${product.price}</button>
      </StripeCheckout>

      <div style={{ marginTop: 10 }}>
        Stripe one time checkout page
        <button onClick={handleCheckout}>Buy React ZTM Course</button>
      </div>

      <div style={{ marginTop: 10 }}>
        Stripe subscription checkout page
        <button onClick={handleSubscriptionCheckout}>
          Subscribe React ZTM Course
        </button>
      </div>
    </div>
  );
}

export default App;
