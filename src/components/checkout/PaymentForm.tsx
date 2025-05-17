
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PaymentFormProps {
  mobileMoney: string;
  setMobileMoney: (value: string) => void;
  isProcessing: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const PaymentForm = ({
  mobileMoney,
  setMobileMoney,
  isProcessing,
  onSubmit,
}: PaymentFormProps) => {
  return (
    <form className="space-y-6" autoComplete="off" onSubmit={onSubmit}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Paiement Cash Pay</h2>
        <div className="space-y-2 mb-4">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-cornerstone-blue">
            Numéro Mobile Money
          </label>
          <input
            type="text"
            id="mobileNumber"
            placeholder="Ex: +228XXXXXXXX"
            value={mobileMoney}
            onChange={e => setMobileMoney(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cornerstone-orange"
          />
          <span className="text-xs text-cornerstone-gray">
            Vous recevrez une notification sur votre téléphone pour confirmer le paiement.
          </span>
        </div>
        <Button
          type="submit"
          disabled={isProcessing}
          variant="orange"
          className="w-full text-base h-12 text-white font-bold"
        >
          {isProcessing ? <>Traitement en cours...</> : <>Payer avec Cash Pay</>}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
