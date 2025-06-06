
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { obtenirToken, envoyerPaiement, verifierStatutCommande } from "@/utils/semoa";
import ContactInfoForm from "@/components/checkout/ContactInfoForm";
import DeliveryAddressForm from "@/components/checkout/DeliveryAddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";

const CheckoutController = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Champs formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [mobileMoney, setMobileMoney] = useState("");
  const orderNumRef = useRef<string | null>(null);

  useEffect(() => {
    obtenirToken().catch(() =>
      toast({
        title: "Erreur API",
        description: "Impossible d'établir la connexion avec l'API de paiement.",
        variant: "destructive",
      })
    );
    if (cart.length === 0) {
      navigate("/panier");
    }
    // eslint-disable-next-line
  }, []);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setMobileMoney("");
    orderNumRef.current = null;
  };

  // Handler pour le paiement Cash Pay via API Semoa
  const handleSemoaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!firstName || !lastName || !email || !phone || !address || !mobileMoney) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir toutes les informations nécessaires.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    const regexIntl = /^\+228\d{8}$/;
    if (!regexIntl.test(mobileMoney)) {
      toast({
        title: "Numéro incorrect",
        description: "Le numéro Mobile Money doit être au format +228XXXXXXXX.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
    const montant = getTotalPrice();

    try {
      const result = await envoyerPaiement({
        amount: montant,
        recipient: mobileMoney,
        service: "FLOOZ",
      });
      if (result.success) {
        toast({
          title: "Paiement initié ✔",
          description: `Commande n° ${result.orderNum} – Attente de validation Mobile Money...`,
        });
        orderNumRef.current = result.orderNum;

        setTimeout(async () => {
          try {
            const s = await verifierStatutCommande(result.orderNum);
            if (s.state === 4 || s.state === "4") {
              toast({
                title: "Paiement confirmé !",
                description: "Votre commande a été payée avec succès.",
              });
              clearCart();
              clearForm();
              navigate("/");
            } else {
              toast({
                title: "Paiement en attente",
                description:
                  "Le paiement est en cours de traitement. Vous pouvez vérifier le statut dans votre historique.",
              });
            }
          } catch {
            // Erreur silencieuse
          }
        }, 5000);
      } else if (result.success === false) {
        toast({
          title: "Échec du paiement",
          description: result.message ?? "Échec du paiement.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Erreur API",
        description: "Impossible d'effectuer l'opération. Réessayez plus tard.",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ContactInfoForm
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setPhone={setPhone}
        />
        <div className="mt-6">
          <DeliveryAddressForm
            address={address}
            notes={notes}
            setAddress={setAddress}
            setNotes={setNotes}
          />
        </div>
        <div className="mt-6">
          <PaymentForm
            mobileMoney={mobileMoney}
            setMobileMoney={setMobileMoney}
            isProcessing={isProcessing}
            onSubmit={handleSemoaPayment}
          />
        </div>
      </div>
      <div className="lg:col-span-1">
        <OrderSummary cart={cart} getTotalPrice={getTotalPrice} />
      </div>
    </div>
  );
};

export default CheckoutController;
