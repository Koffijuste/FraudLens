# FraudLens — Guide de démarrage & tests API

## Lancer les serveurs

### Ordre obligatoire

```
1. MongoDB  →  2. API Python IA  →  3. Backend Node.js
```

---

### Terminal 1 — MongoDB

```powershell
mongod
```

**Résultat attendu :**
```
waiting for connections on port 27017
```

> Si MongoDB n'est pas installé :
> ```powershell
> winget install MongoDB.Server
> ```

---

### Terminal 2 — API Python IA (Membre 1)

```powershell
cd MachineLearning
python -m uvicorn api:app --reload --port 8000
```

**Résultat attendu :**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

> Vérifier que ces fichiers sont présents dans MachineLearning/ :
> - api.py
> - fraud_model.pkl
> - label_encoder.pkl
> - features_list.pkl

---

### Terminal 3 — Backend Node.js

```powershell
cd FraudLens_hackathon
npm run dev
```

**Résultat attendu :**
```
╔══════════════════════════════════════╗
║     FraudLens Backend démarré        ║
║     http://localhost:3000            ║
╚══════════════════════════════════════╝
MongoDB connecté : localhost
```

---

## URLs des serveurs

| Service       | URL                           |
|---------------|-------------------------------|
| Backend API   | http://localhost:3000         |
| API IA Python | http://localhost:8000         |
| Docs IA auto  | http://localhost:8000/docs    |
| MongoDB       | mongodb://localhost:27017     |

---

## Tests Postman — Configuration

### Astuce : variable d'environnement

Dans Postman :
1. Clique **Environments** → **New**
2. Nomme-le `FraudLens`
3. Ajoute variable : `token` (valeur vide pour l'instant)
4. Dans chaque requête, utilise `Bearer {{token}}`

---

## AUTH — Authentification

### 1. Créer un compte agent

```
Méthode  : POST
URL      : http://localhost:3000/api/auth/register
```

**Body (raw JSON) :**
```json
{
  "nom": "Kouassi Jean",
  "email": "jean@fraudlens.ci",
  "password": "secret123",
  "role": "agent"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Compte créé avec succès.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "nom": "Kouassi Jean",
    "email": "jean@fraudlens.ci",
    "role": "agent"
  }
}
```

> Copie la valeur de `token` et colle-la dans la variable Postman `token`.

---

### 2. Créer un compte admin

```
Méthode  : POST
URL      : http://localhost:3000/api/auth/register
```

**Body (raw JSON) :**
```json
{
  "nom": "Admin FraudLens",
  "email": "admin@fraudlens.ci",
  "password": "admin123",
  "role": "admin"
}
```

---

### 3. Se connecter

```
Méthode  : POST
URL      : http://localhost:3000/api/auth/login
```

**Body (raw JSON) :**
```json
{
  "email": "jean@fraudlens.ci",
  "password": "secret123"
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Connexion réussie.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "nom": "Kouassi Jean",
    "email": "jean@fraudlens.ci",
    "role": "agent"
  }
}
```

---

### 4. Vérifier son profil

```
Méthode  : GET
URL      : http://localhost:3000/api/auth/me
Headers  : Authorization: Bearer {{token}}
```

**Réponse attendue :**
```json
{
  "success": true,
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "nom": "Kouassi Jean",
    "email": "jean@fraudlens.ci",
    "role": "agent"
  }
}
```

---

## CLAIMS — Sinistres

### 5. Soumettre un sinistre NORMAL

```
Méthode  : POST
URL      : http://localhost:3000/api/claims
Headers  : Authorization: Bearer {{token}}
```

**Body (raw JSON) :**
```json
{
  "assure": {
    "nom": "Brou Amenan",
    "telephone": "0707111222",
    "numero_police": "POL-2024-100"
  },
  "type_sinistre": "accident_auto",
  "montant_fcfa": 150000,
  "date_sinistre": "2024-11-01",
  "description": "Accrochage léger en ville",
  "age_compte_mois": 36,
  "nb_sinistres_12m": 1,
  "nb_docs_fournis": 4,
  "sinistres_similaires": 0
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Sinistre enregistré et analysé.",
  "claim": {
    "statut": "approuve",
    "fraud_score": {
      "score": 12,
      "niveau": "normal",
      "raisons": ["Aucune anomalie majeure détectée"],
      "probabilite": 0.12
    }
  }
}
```

---

### 6. Soumettre un sinistre SUSPECT

```
Méthode  : POST
URL      : http://localhost:3000/api/claims
Headers  : Authorization: Bearer {{token}}
```

**Body (raw JSON) :**
```json
{
  "assure": {
    "nom": "Yao Kouakou",
    "telephone": "0505333444",
    "numero_police": "POL-2024-200"
  },
  "type_sinistre": "accident_moto",
  "montant_fcfa": 900000,
  "date_sinistre": "2024-10-01",
  "description": "Accident sur la route de Yamoussoukro",
  "age_compte_mois": 8,
  "nb_sinistres_12m": 3,
  "nb_docs_fournis": 2,
  "sinistres_similaires": 1
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "claim": {
    "statut": "en_analyse",
    "fraud_score": {
      "score": 52,
      "niveau": "suspect",
      "raisons": [
        "3 sinistres en 12 mois",
        "Documents insuffisants pour ce montant"
      ]
    }
  }
}
```

---

### 7. Soumettre un sinistre FRAUDE PROBABLE

```
Méthode  : POST
URL      : http://localhost:3000/api/claims
Headers  : Authorization: Bearer {{token}}
```

**Body (raw JSON) :**
```json
{
  "assure": {
    "nom": "Konan Eric",
    "telephone": "0101555666",
    "numero_police": "POL-2024-999"
  },
  "type_sinistre": "accident_moto",
  "montant_fcfa": 3500000,
  "date_sinistre": "2024-09-01",
  "description": "Accident grave, véhicule totalement détruit",
  "age_compte_mois": 3,
  "nb_sinistres_12m": 5,
  "nb_docs_fournis": 1,
  "sinistres_similaires": 3
}
```

**Réponse attendue :**
```json
{
  "success": true,
  "claim": {
    "statut": "en_investigation",
    "fraud_score": {
      "score": 87,
      "niveau": "fraude_probable",
      "raisons": [
        "5 sinistres en 12 mois (seuil : 4)",
        "Montant 3 500 000 FCFA — compte jeune (3 mois)",
        "3 déclarations similaires détectées"
      ]
    }
  }
}
```

---

### 8. Lister tous les sinistres

```
Méthode  : GET
URL      : http://localhost:3000/api/claims
Headers  : Authorization: Bearer {{token}}
```

**Filtres disponibles (paramètres URL) :**
```
?statut=en_investigation     → sinistres en cours d'enquête
?statut=approuve             → sinistres approuvés
?statut=rejete               → sinistres rejetés
?niveau=fraude_probable      → filtre par niveau IA
?page=1&limit=10             → pagination
```

Exemple avec filtres :
```
GET http://localhost:3000/api/claims?statut=en_investigation&page=1&limit=5
```

---

### 9. Détail d'un sinistre

```
Méthode  : GET
URL      : http://localhost:3000/api/claims/<id_du_sinistre>
Headers  : Authorization: Bearer {{token}}
```

> Remplace `<id_du_sinistre>` par l'`_id` reçu lors de la création.

---

### 10. Prendre une décision sur un sinistre

```
Méthode  : PATCH
URL      : http://localhost:3000/api/claims/<id_du_sinistre>/decision
Headers  : Authorization: Bearer {{token}}
```

**Valider un sinistre :**
```json
{
  "decision": "valide",
  "commentaire": "Dossier complet, sinistre confirmé après vérification terrain."
}
```

**Rejeter un sinistre :**
```json
{
  "decision": "rejete",
  "commentaire": "Score fraude trop élevé, 3 déclarations similaires identifiées."
}
```

---

### 11. Supprimer un sinistre (admin uniquement)

```
Méthode  : DELETE
URL      : http://localhost:3000/api/claims/<id_du_sinistre>
Headers  : Authorization: Bearer {{token_admin}}
```

---

## DASHBOARD — Statistiques

### 12. Récupérer les stats du dashboard

```
Méthode  : GET
URL      : http://localhost:3000/api/dashboard
Headers  : Authorization: Bearer {{token}}
```

**Réponse attendue :**
```json
{
  "success": true,
  "stats": {
    "total": 15,
    "en_attente": 2,
    "en_investigation": 4,
    "approuves": 7,
    "rejetes": 2,
    "taux_fraude": "26.7"
  },
  "niveaux_fraude": [
    { "_id": "normal", "count": 8, "score_moyen": 18.5 },
    { "_id": "suspect", "count": 4, "score_moyen": 51.2 },
    { "_id": "fraude_probable", "count": 3, "score_moyen": 84.7 }
  ],
  "top_suspects": [...],
  "evolution_7j": [...],
  "montant_par_type": [...]
}
```

---

## API IA Python — Tests directs

### 13. Test santé de l'API IA

```
Méthode  : GET
URL      : http://localhost:8000/health
```

**Réponse attendue :**
```json
{
  "status": "ok",
  "model": "RandomForest",
  "version": "1.0"
}
```

---

### 14. Test direct du modèle IA

```
Méthode  : POST
URL      : http://localhost:8000/predict
```

**Body (raw JSON) — cas normal :**
```json
{
  "age_compte_mois": 36,
  "nb_sinistres_12m": 1,
  "montant_fcfa": 200000,
  "type_sinistre": "accident_auto",
  "nb_docs_fournis": 4,
  "delai_declaration_jours": 5,
  "sinistres_similaires": 0
}
```

**Body (raw JSON) — cas fraude :**
```json
{
  "age_compte_mois": 3,
  "nb_sinistres_12m": 5,
  "montant_fcfa": 3500000,
  "type_sinistre": "accident_moto",
  "nb_docs_fournis": 1,
  "delai_declaration_jours": 72,
  "sinistres_similaires": 3
}
```

---

## Codes d'erreur fréquents

| Code | Signification               | Solution                                      |
|------|-----------------------------|-----------------------------------------------|
| 401  | Token manquant ou expiré    | Refaire /login et copier le nouveau token     |
| 403  | Accès interdit              | Utiliser un compte admin pour cette action    |
| 404  | Route ou document introuvable | Vérifier l'URL et l'ID utilisé              |
| 422  | Champs manquants dans le body | Vérifier le JSON envoyé (raw + JSON coché)  |
| 500  | Erreur serveur              | Vérifier que MongoDB et l'API Python tournent |

---

## Checklist avant la démo

- [ ] MongoDB tourne (`mongod`)
- [ ] API Python répond sur `:8000/health`
- [ ] Backend répond sur `:3000`
- [ ] Test register + login fonctionnel
- [ ] Sinistre normal → score < 40
- [ ] Sinistre fraude → score > 70 + raisons affichées
- [ ] Dashboard renvoie les stats
- [ ] Frontend branché sur `:3000`