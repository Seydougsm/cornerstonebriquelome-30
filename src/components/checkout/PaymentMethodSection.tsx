
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PaymentMethodSectionProps {
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  mobileMoney: string;
  setMobileMoney: (v: string) => void;
}

const PaymentMethodSection = ({
  paymentMethod,
  setPaymentMethod,
  mobileMoney,
  setMobileMoney,
}: PaymentMethodSectionProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Méthode de paiement</h2>
    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
      <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:border-cornerstone-orange">
        <RadioGroupItem id="mobile" value="mobile" />
        <Label htmlFor="mobile" className="flex items-center cursor-pointer flex-1">
          <Wallet className="mr-2 text-cornerstone-orange" size={20} />
          <div>
            <p className="font-medium">Mobile Money</p>
            <p className="text-xs text-cornerstone-gray">Paiement via T-Money, Flooz, etc.</p>
          </div>
        </Label>
      </div>
      <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:border-cornerstone-orange opacity-60 pointer-events-none">
        <RadioGroupItem id="card" value="card" disabled />
        <Label htmlFor="card" className="flex items-center cursor-not-allowed flex-1">
          <CreditCard className="mr-2 text-cornerstone-orange" size={20} />
          <div>
            <p className="font-medium">Carte bancaire</p>
            <p className="text-xs text-cornerstone-gray">Prochainement disponible</p>
          </div>
        </Label>
      </div>
    </RadioGroup>
    {paymentMethod === "mobile" && (
      <div className="mt-4 space-y-4 p-4 border border-dashed rounded-md">
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Numéro Mobile Money</Label>
          <Input
            id="mobileNumber"
            placeholder="Ex: +228 XX XX XX XX"
            value={mobileMoney}
            onChange={e => setMobileMoney(e.target.value)}
            required
          />
        </div>
        <p className="text-xs text-cornerstone-gray">
          Vous recevrez une notification sur votre téléphone pour confirmer le paiement.
        </p>
      </div>
    )}
  </div>
);

export default PaymentMethodSection;
