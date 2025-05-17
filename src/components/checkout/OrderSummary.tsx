
import { Check } from "lucide-react";
import { CartProduct } from "@/contexts/CartContext";

interface OrderSummaryProps {
  cart: CartProduct[];
  getTotalPrice: () => number;
}

const OrderSummary = ({ cart, getTotalPrice }: OrderSummaryProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
    <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Résumé de la commande</h2>
    <div className="space-y-4 mb-6">
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between border-b pb-3">
          <div>
            <p className="font-medium text-cornerstone-blue">
              {item.name} <span className="text-cornerstone-gray">x {item.quantity}</span>
            </p>
            <p className="text-xs text-cornerstone-gray">
              {item.type} - {item.size}
            </p>
          </div>
          <span className="font-medium">{item.price * item.quantity} FCFA</span>
        </div>
      ))}
    </div>
    <div className="space-y-2 mb-6">
      <div className="flex justify-between">
        <span className="text-cornerstone-gray">Sous-total:</span>
        <span className="font-medium">{getTotalPrice()} FCFA</span>
      </div>
      <div className="flex justify-between">
        <span className="text-cornerstone-gray">Livraison:</span>
        <span className="text-cornerstone-gray">À définir</span>
      </div>
    </div>
    <div className="flex justify-between font-bold border-t pt-2 mb-6">
      <span>Total TTC:</span>
      <span className="text-cornerstone-orange">{getTotalPrice()} FCFA</span>
    </div>
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="flex items-start">
        <Check size={16} className="text-green-500 mt-1 mr-2" />
        <p className="text-xs text-cornerstone-gray">
          En passant commande, vous acceptez nos conditions générales de vente et reconnaissez avoir pris connaissance de notre politique de confidentialité.
        </p>
      </div>
    </div>
  </div>
);

export default OrderSummary;
