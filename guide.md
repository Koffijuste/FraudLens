# Guide de démarrage local

## Objectif
Ce guide permet de lancer l’application complète en local : frontend, backend, IA et base de données.

## Prérequis
- Node.js installé
- Python installé
- MongoDB installé et en cours d’exécution
- Avoir installé les dépendances Python dans `MachineLearning`

## Étapes pour lancer l’application

### 1. Démarrer MongoDB
Ouvre un terminal et exécute :

```powershell
mongod
```

### 2. Démarrer l’API Python IA
Ouvre un terminal séparé :

```powershell
cd C:\Users\Kaeloo\Desktop\FraudLens_Hackathon\MachineLearning
python -m uvicorn api:app --reload --port 8000
```

### 3. Démarrer le backend Node.js
Ouvre un troisième terminal :

```powershell
cd C:\Users\Kaeloo\Desktop\FraudLens_Hackathon
npm run dev
```

### 4. Installer les dépendances frontend (une seule fois)
Ouvre un terminal et exécute :

```powershell
cd C:\Users\Kaeloo\Desktop\FraudLens_Hackathon\fraudlens-frontend
npm install
```

> Si `next` n’est pas reconnu, c’est que les dépendances locales n’ont pas été installées dans `fraudlens-frontend`.

### 5. Démarrer le frontend Next.js
Ouvre un autre terminal et exécute :

```powershell
cd C:\Users\Kaeloo\Desktop\FraudLens_Hackathon\fraudlens-frontend
npm run dev -- --port 3001
```

> Le frontend doit être lancé sur un port différent du backend, car le backend utilise déjà le port `3000`.

## Fichiers importants
- `fraudlens-frontend/.env.local` doit contenir : `NEXT_PUBLIC_API_URL=http://localhost:3000`
- `MachineLearning/api.py` doit être démarré sur `http://localhost:8000`
- Le backend Node.js écoute sur `http://localhost:3000`

## URLs locales
- Frontend : `http://localhost:3001`
- Backend API : `http://localhost:3000`
- API IA Python : `http://localhost:8000`

## Contrôle rapide
- Si le frontend n’apparaît pas, vérifie que le backend est bien sur `3000` et que la variable `NEXT_PUBLIC_API_URL` pointe vers `http://localhost:3000`.
- Si l’API IA ne démarre pas, vérifie les fichiers présents dans `MachineLearning/` : `api.py`, `fraud_model.pkl`, `label_encoder.pkl`, `features_list.pkl`.
