const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const stripePaymentMethod = async (amount, paymentType, paymentMethodTypes) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: paymentType,
      payment_method_types: [paymentMethodTypes],
    });
    // console.log("clientSecret", paymentIntent.client_secret);
    if (paymentIntent) return paymentIntent;
    else return false;
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = stripePaymentMethod;
