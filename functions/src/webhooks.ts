import * as functions from "firebase-functions";
import { stripe } from "./stripe";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
admin.initializeApp();

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return; // 여기서 그냥 return; 타입 맞춤
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const orderData = {
      customer_name: session.metadata.customer_name,
      customer_email: session.customer_email,
      customer_phone: session.metadata.customer_phone,
      customer_address: session.metadata.customer_address,
      order_items: JSON.parse(session.metadata.order_items),
      total_amount: session.amount_total,
      currency: session.currency,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await admin.firestore().collection("orders").add(orderData);
      console.log("Order saved to Firestore:", orderData);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  }

  res.json({ received: true }); // 여기서도 return 없이 호출
});
