
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
}

const ContactInfoForm = ({
  firstName,
  lastName,
  email,
  phone,
  setFirstName,
  setLastName,
  setEmail,
  setPhone,
}: ContactInfoFormProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Informations de contact</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input id="firstName" required placeholder="Votre prénom" value={firstName} onChange={e => setFirstName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input id="lastName" required placeholder="Votre nom" value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>
    </div>
    <div className="space-y-2 mt-4">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" required placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
    </div>
    <div className="space-y-2 mt-4">
      <Label htmlFor="phone">Téléphone</Label>
      <Input id="phone" required placeholder="Votre numéro de téléphone" value={phone} onChange={e => setPhone(e.target.value)} />
    </div>
  </div>
);

export default ContactInfoForm;
