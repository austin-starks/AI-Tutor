import { Request, Response } from "./types";
import Stripe from "stripe";
import "dotenv/config";
import { handleError } from "./common";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const mapAmountToPrice = (amount: number) => {
  switch (amount) {
    case 50:
      return 2500;
    case 200:
      return 5000;
    case 800:
      return 10000;
    default:
      throw new Error("Invalid amount");
  }
};

class PaymentController {
  public async submitPayment(req: Request, res: Response) {
    let { id } = req.body;
    const amount = mapAmountToPrice(req.body.amount);
    try {
      await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Purchasing tokens for StarkTech Tutor",
        payment_method: id,
        confirm: true,
      });
      const balance = await req.user.addBalance(req.body.amount);
      // increment the number of tokens
      res.json({
        message: "Payment successful",
        success: true,
        balance,
      });
    } catch (err) {
      handleError(err, res);
    }
  }
}

export default new PaymentController();
