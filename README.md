# PMT – Project Management Tool · Frontend

Interface web de la plateforme de gestion de projet collaboratif **PMT**, développée avec
Angular 21 et la bibliothèque de composants Taiga UI.

| | |
|---|---|
| **Frontend** (ce dépôt) | Angular 21 / Taiga UI / Jest — [PMT-Visual](https://github.com/mikeHelderal/PMT-Visual) |
| **Backend** | Spring Boot 3.5 / Java 21 / PostgreSQL 15 — [PMT-Project](https://github.com/mikeHelderal/PMT-Project) |

> Le `docker-compose.yml` de la stack complète (base + API + interface) se trouve dans le
> dépôt backend, qui porte aussi la procédure de déploiement de bout en bout.
> Le dépôt `PMT-Front` est une première tentative abandonnée : il ne fait pas partie des livrables.

---

## Sommaire

1. [Démarrage rapide](#1-démarrage-rapide)
2. [Structure du projet](#2-structure-du-projet)
3. [Tests et couverture](#3-tests-et-couverture)
4. [Image Docker](#4-image-docker)
5. [Pipeline CI/CD](#5-pipeline-cicd)

---

## 1. Démarrage rapide

### Prérequis

- Node.js 20+ et npm
- Le backend démarré et accessible sur `http://localhost:8081`
  (voir le README du dépôt PMT-Project)

```bash
npm ci        # installation reproductible depuis le lock-file
npm start     # serveur de développement sur http://localhost:4200
```

L'application se recharge automatiquement à chaque modification des sources.

### Comptes de démonstration

Chargés par le script d'initialisation du backend, mot de passe **`admin123`** :

| E-mail | Rôle sur le projet 1 | Ce qu'il peut faire |
|---|---|---|
| `admin@pmt.com` | ADMIN | Tout, y compris inviter des membres et changer leurs rôles |
| `jean.dupont@pmt.com` | MEMBER | Créer, assigner et mettre à jour des tâches |
| `marie.curie@pmt.com` | GUEST | Consultation seule : tableau de bord, tâches, historique |

### Adresse de l'API

L'URL du backend est définie dans les services (`src/app/services/**`) et pointe vers
`http://localhost:8081`. C'est l'adresse exposée par le conteneur `pmt-api` du
`docker-compose`, donc valable aussi bien en développement qu'avec la stack conteneurisée.

---

## 2. Structure du projet

```
src/app/
  components/
    login/ register/              Authentification
    projects/                     Liste, carte, détail et membres d'un projet
    tasks/                        Formulaire, liste, ligne de tâche, assignation
    project-dashboard/            Répartition des tâches par statut
    project-member-invite/        Invitation par e-mail avec choix du rôle
    project-member-list/          Membres du projet et leurs rôles
    task-history/                 Historique des modifications d'une tâche
    toast-container/              Notifications à l'écran
  services/
    auth/                         Inscription, connexion, membre courant
    project/                      Appels API projets + état partagé du projet courant
    projectMember/                Membres et rôles
    task/                         Tâches, statuts, assignation, historique
    notifications/                Toasts (signals)
  models/                         Interfaces TypeScript du domaine
```

Le projet utilise les API modernes d'Angular : composants **standalone**, **signals**
(`signal`, `input.required`, `output`) et injection par `inject()`. La validation des
formulaires s'appuie sur **Vest** (fichiers `*.validation.ts` et `*.suite.ts`).

---

## 3. Tests et couverture

Les tests unitaires utilisent **Jest** via `jest-preset-angular`.

```bash
npm test              # exécute la suite de tests
npm run test:watch    # mode watch pendant le développement
npm run test:coverage # tests + rapport de couverture
```

Rapport de couverture : **`coverage/pmt-frontend/index.html`**

| | Instructions | Branches | Seuil exigé |
|---|---|---|---|
| Frontend | 91,9 % | 74,0 % | 60 % |

Le seuil est appliqué automatiquement : `jest.config.js` déclare un `coverageThreshold`
de 60 % sur les instructions et les branches, et `collectCoverageFrom` inclut **tout**
`src/app` — y compris les fichiers qu'aucun test n'atteint, pour que le chiffre reflète
la réalité. Les interfaces de `models/` et le bootstrap de l'application sont exclus car
ils ne portent aucune logique.

---

## 4. Image Docker

Le `Dockerfile` est multi-stage : build Angular en production sous Node 20, puis service
des fichiers statiques par nginx.

```bash
docker build -t mike230/pmt-frontend:latest .
docker run -p 4200:80 mike230/pmt-frontend:latest
```

La configuration nginx redirige toutes les routes inconnues vers `index.html`
(`try_files ... /index.html`), indispensable au routage côté client d'Angular.

Pour lancer l'application complète (base + API + interface), utiliser le
`docker-compose.yml` du dépôt backend.

---

## 5. Pipeline CI/CD

Workflow : `.github/workflows/ci-frontend.yml`, déclenché sur `push` et `pull_request`
vers `develop`.

```
checkout ──▶ Node 20 (cache npm) ──▶ npm ci ──▶ tests + couverture ──▶ build prod ──▶ push image
                                                (seuil 60 % appliqué)         pmt-frontend:latest
```

Le rapport de couverture est archivé comme artefact du run et reste téléchargeable depuis
l'onglet **Actions**. Le push d'image n'a lieu que sur un `push` de branche : une pull
request exécute les tests sans publier d'image.

### Secrets GitHub à configurer

| Secret | Contenu |
|---|---|
| `DOCKERHUB_USERNAME` | Identifiant Docker Hub |
| `DOCKERHUB_TOKEN` | Access token Docker Hub (Account Settings → Security) |
