# Projet WeCook

Ce document décrit comment configurer et lancer le projet.

## Configuration

### Variables d'environnement et installation des dépendances

#### Backend

Dans le dossier `backend` :

1. Dupliquez le fichier `.env` pour créer un nouveau fichier `.env.local`.
2. Pour les variables qui concernent la base de données voici ce qu'il faut mettre : `DB_NAME=database`, `DB_USER=root`, `DB_PASSWORD=root`
3. Ajoutez votre clé API OpenAI dans le fichier `.env.local` en remplaçant `default` par votre clé.
3. Exécutez la commande suivante dans le terminal :
```bash
npm install
```

#### Frontend

Dans le dossier `frontend` :

1. Dupliquez le fichier `.env` pour créer un nouveau fichier `.env.local`.
2. Exécutez la commande suivante dans le terminal :
```bash
npm install
```

## Lancement du projet

### Docker

A la racine du projet, exécutez la commande suivante pour lancer Docker :

```bash
docker compose up
```

#### Backend

Dans le dossier `backend`, exécutez la commande suivante pour lancer le backend :

```bash
npm run start
```

#### Frontend

Dans le dossier `frontend`, exécutez la commande suivante pour lancer le frontend :

```bash
npm run dev
```

## Création de la base de données / utiliser les fixtures

Dans le dossier `backend`, exécutez la commande suivante pour créer la base de données utiliser les fixtures :
```bash
node migration.js
```