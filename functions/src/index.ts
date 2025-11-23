import * as functions from "firebase-functions";
import { stripe } from "./stripe";
import cors from "cors";

const corsHandler = cors({ origin: ["http://localhost:5173"] });

interface CartItem {
  id: string;
  name: string;
  price: number; // 센트 단위
  quantity: number;
}

// 모든 origin 허용

export const createCheckoutSession = functions.https.onRequest((req, res) => {
  // corsHandler 안에서 실제 로직 실행
  corsHandler(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { items }: { items: CartItem[] } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).send("Cart is empty");
      }

      const line_items = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Unknown Product",
          },
          unit_amount: Math.floor(item.price), // Stripe는 정수만 허용
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
      });

      return res.status(200).json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe session creation error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Stripe session creation failed" });
    }
  });
});
