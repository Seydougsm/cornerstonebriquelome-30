
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Check } from "lucide-react";
import { obtenirToken, envoyerPaiement, verifierStatutCommande } from "@/utils/semoa";

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("mobile");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Champs formulaire
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [mobileMoney, setMobileMoney] = useState("");
  // Pour garder le numéro de commande si besoin de vérifier le statut
  const orderNumRef = useRef<string | null>(null);

  useEffect(() => {
    // On obtient le token à l’arrivée sur la page.
    obtenirToken().catch(() =>
      toast({
        title: "Erreur API",
        description: "Impossible d'établir la connexion avec l'API de paiement.",
        variant: "destructive",
      })
    );
    // Rediriger si panier vide
    if (cart.length === 0) {
      navigate("/panier");
    }
    // eslint-disable-next-line
  }, []);

  // Nettoyage après paiement
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

  // Handler principal de paiement via Semoa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!firstName || !lastName || !email || !phone || !address) {
      toast({
        title: "Champs obligatoires manquants",
        description: "Veuillez remplir toutes les informations nécessaires.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    if (paymentMethod === "mobile") {
      // Vérification simple du numéro mobile money
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
      // Calcul du montant total
      const montant = getTotalPrice();

      // Appel API Semoa ici
      try {
        const result = await envoyerPaiement({
          amount: montant,
          recipient: mobileMoney,
          service: "FLOOZ", // Personnalisable selon les besoins/minute
        });
        if (result.success) {
          toast({
            title: "Paiement initié ✔",
            description: `Commande n° ${result.orderNum} – Attente de validation Mobile Money...`,
          });
          orderNumRef.current = result.orderNum;

          // Optionnel : vérifier de façon asynchrone le statut.
          setTimeout(async () => {
            try {
              const s = await verifierStatutCommande(result.orderNum);
              if (s.state === 4 || s.state === "4") {
                toast({
                  title: "Paiement confirmé !",
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
              // Non bloquant : si on ne parvient pas à vérifier, rien à faire
            }
          }, 5000);
        } else {
          toast({
            title: "Échec du paiement",
            description: result.message,
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
    }
    // Extension possible : gestion carte bancaire (hors périmètre pour cette intégration)
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="title text-center mb-8">Paiement</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {/* Infos contact */}
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
              {/* Adresse */}
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
              {/* Paiement */}
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
              <Button type="submit" disabled={isProcessing} className="w-full bg-cornerstone-orange hover:bg-cornerstone-orange/90 text-white">
                {isProcessing ? <>Traitement en cours...</> : <>Confirmer la commande</>}
              </Button>
            </form>
          </div>
          {/* Résumé */}
          <div className="lg:col-span-1">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

