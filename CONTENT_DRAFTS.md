# Brouillons de contenu — à relire avant la mise en ligne

Ces textes sont **uniquement dans la base de développement** (branche Neon `dev`, visible sur `localhost:3000`).
Rien n'est en production. Chaque réponse s'appuie sur une information déjà présente sur le site (source indiquée).
Les éléments marqués **[À CONFIRMER]** sont **masqués** (`Afficher cette FAQ sur le site` décoché) jusqu'à validation.

## FAQ (Admin → FAQ)

| # | Question | Réponse (résumé) | Source | Visible |
|---|---|---|---|---|
| 1 | Comment fonctionne un voyage sur-mesure ? | Projet décrit via formulaire ou WhatsApp → itinéraire + devis ajusté ensemble | Page Sur-Mesure | ✅ |
| 2 | Comment réserver un circuit ? | Bouton réserver / WhatsApp ; réservation définitive après **acompte de 30 %** | CGV | ✅ |
| 3 | Quels sont les moyens de paiement ? | **Virement bancaire ou QR code**, preuve envoyée sur WhatsApp | Paramètres de paiement, pied de page | ✅ |
| 4 | Quand dois-je payer le solde ? | **30 jours avant le départ** | CGV | ✅ |
| 5 | Que comprend le prix ? | Prix en **€ par personne** ; prestations du programme ; **vols internationaux, assurances, dépenses perso non inclus** sauf mention | CGV | ✅ |
| 6 | Conditions d'annulation ? | **> 60 j** : acompte remboursé · **30–60 j** : 50 % retenus · **< 30 j** : aucun remboursement | CGV | ✅ |
| 7 | Maroc et international ? | Liste des destinations du CMS | Collection Destinations | ✅ |
| 8 | Petits groupes ? | **[À CONFIRMER]** 12 personnes max ; voyages privés famille / noces / entreprise | Valeur par défaut du CMS (non vérifiée) | ❌ masqué |
| 9 | Visa et assurance ? | **[À CONFIRMER]** conseils formalités + assurance | Aucune — à valider | ❌ masqué |
| 10 | Comment vous contacter ? | WhatsApp en priorité, email, formulaire Contact | Page Contact | ✅ |

Pour publier en production après relecture : recréer ces entrées dans l'admin de production (Admin → FAQ), ou me demander de les copier depuis `dev`.

## Incohérences trouvées sur le site (à corriger)

1. **Mentions légales : hébergeur faux.** La page indique *Vercel Inc.* — le site est hébergé chez **Hostinger**. (`src/app/(frontend)/mentions-legales/page.tsx`)
2. **Deux numéros WhatsApp différents.** Mentions légales : **+212 661 373 347** ; page Contact (CMS) : **+212 661 898 865**. Lequel est le bon ?
3. **Témoignage « Julien B. »** : destination *Vietnam*, mais la vidéo est celle de Merzouga.
4. **Témoignage « merzouga team »** : nom provisoire et aucun texte.

## Encore vide (aucun brouillon écrit — demande ton accord)

- **Blog** : 0 article. Je peux proposer 2–3 articles (ex. *Guide Merzouga*, *Préparer son voyage à Zanzibar*) à partir des fiches destinations existantes.
- **Hero Gallery / Hero Vidéos** (admin) : vides → le site utilise les vidéos intégrées. À remplir quand les vidéos compressées seront prêtes.
