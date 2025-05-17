
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DeliveryAddressFormProps {
  address: string;
  notes: string;
  setAddress: (v: string) => void;
  setNotes: (v: string) => void;
}

const DeliveryAddressForm = ({
  address,
  notes,
  setAddress,
  setNotes,
}: DeliveryAddressFormProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Adresse de livraison</h2>
    <div className="space-y-2">
      <Label htmlFor="address">Adresse complète</Label>
      <Textarea id="address" required placeholder="Votre adresse de livraison" value={address} onChange={e => setAddress(e.target.value)} />
    </div>
    <div className="space-y-2 mt-4">
      <Label htmlFor="notes">Instructions spéciales (facultatif)</Label>
      <Textarea id="notes" placeholder="Instructions particulières pour la livraison" value={notes} onChange={e => setNotes(e.target.value)} />
    </div>
  </div>
);

export default DeliveryAddressForm;
