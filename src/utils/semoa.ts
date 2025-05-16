
/**
 * Outils d'intégration à l'API Semoa sandbox.
 * Toutes les fonctions sont commentées pour faciliter la maintenance.
 */

const API_URL = "https://api.semoa-payments.ovh/sandbox";
const authInfos = {
  username: "api_cashpay.corner",
  password: "qH5VlCDCa4",
  client_id: "cashpay",
  client_secret: "HpuNOm3sDOkAvd8v3UCIxiBu68634BBs",
};

// Stocke le token de façon temporaire
const TOKEN_KEY = "semoa_access_token";

// Récupération et stockage du token dans localStorage
export async function obtenirToken(): Promise<string | null> {
  // Vérifie s'il existe déjà un token non expiré
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing) return existing;

  // Appel POST pour obtenir le token
  const res = await fetch(`${API_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: "TjpiCTZANOmeTSW7eFUHvcoJdtMAwbzrXWyA" },
    body: JSON.stringify(authInfos),
  });
  if (!res.ok) throw new Error("Échec connexion API Semoa");
  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return data.access_token;
  }
  throw new Error("Aucun token reçu");
}

// Envoi d'une commande Mobile Money via Semoa
interface PaiementParams {
  amount: number;
  recipient: string; // format international +228XXXXXX
  service: "FLOOZ" | "XPRESS";
  nature?: string;
}

// Résultat typé pour mieux traiter la réponse dans le composant
type PaiementResult =
  | { success: true; orderNum: string }
  | { success: false; message: string };

// Renvoie l'objet { success, orderNum } ou { success, message }
export async function envoyerPaiement({
  amount,
  recipient,
  service = "FLOOZ",
  nature = "CD",
}: PaiementParams): Promise<PaiementResult> {
  const token = await obtenirToken();
  if (!token) return { success: false, message: "Impossible d'obtenir un token" };

  const res = await fetch(`${API_URL}/services/tg/mobile-money/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: "TjpiCTZANOmeTSW7eFUHvcoJdtMAwbzrXWyA",
    },
    body: JSON.stringify({ amount, recipient, service, nature }),
  });
  const data = await res.json();

  if (res.ok && (data.state === 4 || data.state === "4")) {
    return { success: true, orderNum: data.orderNum };
  }
  return { success: false, message: data.message || "Échec du paiement." };
}

// Vérifie dynamiquement le statut de la commande
export async function verifierStatutCommande(orderNum: string): Promise<any> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) throw new Error("Token non disponible");

  const res = await fetch(`${API_URL}/services/tg/orders/${orderNum}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: "TjpiCTZANOmeTSW7eFUHvcoJdtMAwbzrXWyA",
    },
  });
  if (!res.ok) throw new Error("Impossible de vérifier le statut de la commande.");
  return res.json();
}
