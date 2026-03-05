# Plateforme de Charité IHSAN 🌙

Projet développé pour le **SupNum Coding Challenge S3C’1447**.

IHSAN est une application de charité radicalement transparente avec une traçabilité complète des dons. Le backend utilise Express, Prisma, PostgreSQL et Zod pour la validation. Le frontend est construit avec Vite, React et utilise un design premium bilingue (Arabe/Français).

---

## 🚀 Comment lancer le projet sur votre machine (Pour l'équipe)

Si vous venez de cloner ce dépôt depuis GitHub, voici les étapes à suivre pour faire fonctionner l'ensemble du projet :

### 1. Cloner le projet
```bash
git clone https://github.com/cheikh-196/ihsan-charity-platform.git
cd ihsan-charity-platform
```

### 2. Démarrer le Backend (Port 3000)
Ouvrez un premier terminal et allez dans le dossier du backend :
```bash
cd ihsan-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# ⚠️ Copiez le fichier .env.example vers un nouveau fichier nommé .env
cp .env.example .env
```
👉 **Ouvrez le fichier `.env` nouvellement créé et remplacez les identifiants de la base de données par ceux fournis par votre chef d'équipe.**

Une fois le fichier `.env` bien configuré :
```bash
# Générer le client Prisma et synchroniser la base de données
npx prisma generate
npx prisma db push

# Lancer le serveur en mode développement
npm run dev
```
Le backend tourne maintenant sur `http://localhost:3000` ! ✅

---

### 3. Démarrer le Frontend (Port 5173)
Ouvrez un **deuxième terminal** (laissez le premier tourner en arrière-plan) et allez dans le dossier du frontend :
```bash
# Depuis la racine du projet
cd ihsan-frontend

# Installer les dépendances
npm install

# Lancer le serveur frontend
npm run dev
```
Le frontend est visble sur `http://localhost:5173` ! ✅

---

## 👥 Les Rôles de l'Application

Pour tester l'application complète, il est recommandé de créer plusieurs comptes avec des rôles différents :

1.  **DONOR (Donneur) :** Rôle par défaut. Peut consulter les besoins, faire un don (simulation), et recevoir un reçu avec le hash SHA-256.
2.  **VALIDATOR (Validateur) :** Accède au tableau de bord privé. Peut publier de nouveaux besoins sur la plateforme et confirmer la remise des dons sur le terrain (générant ainsi la preuve d'impact et fixant la transaction).
3.  **PARTNER (Partenaire) :** Rôle optionnel pour les marchands et prestataires locaux.

## 🔗 Architecture et Stack
*   **Backend :** Node.js, Express.js, Prisma ORM, PostgreSQL (hébergé sur Supabase).
*   **Sécurité :** JWT pour l'authentification, bcrypt pour le hashage des mots de passe.
*   **Immuabilité :** Le système calcule un Hash SHA-256 déterministe pour chaque transaction.
*   **Frontend :** React.js, Vite, React Router, TailwindCSS/Vanilla CSS (System Design Custom), i18next (Traduction FR/AR).
