
import CheckoutController from "@/components/checkout/CheckoutController";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="title text-center mb-8">Paiement Cash Pay</h1>
        <CheckoutController />
      </div>
    </div>
  );
};

export default CheckoutPage;
