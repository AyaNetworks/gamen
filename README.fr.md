# Gamen (画面)

Une maquette UI explorant le **design orienté artefacts pour les workflows multi-agents IA**. Gamen démontre quatre paradigmes fondamentaux:

1. **Écran orienté artefacts** — Les sorties et artefacts IA sont des citoyens de première classe, pas du chat éphémère
2. **Renouvellement automatique du prompt d'agent** — Édition dynamique des directives pour la reconfiguration d'agent en temps réel
3. **Gestion des outils et tâches dirigée par l'utilisateur** — Contrôle utilisateur explicite sur l'exécution des outils et l'orchestration des tâches
4. **Intégration de la base de connaissances** — Bibliothèque de documents unifiée pour l'intelligence contextuelle

Construit avec React 19, Zustand et Framer Motion. Inspiré par les concepts d'espace de travail Dione. Licence MIT.

---

## 🎯 Philosophie

### Écran orienté artefacts

L'espace de travail traite les sorties IA comme des **artefacts persistants**, pas des messages transitoires:

- **Traces de pensée**: Raisonnement IA étape par étape avec détails d'exécution
- **Journaux d'exécution d'outils**: Arguments d'outil, résultats, traces d'erreur et horodatages
- **Artefacts collaboratifs**: Carnets Markdown avec contrôle de version et publication
- **Connaissances contextuelles**: Bibliothèque de documents à double source (base de connaissances + uploads utilisateur)

Chaque artefact reste visible et accessible dans le même espace de travail, créant un contexte persistant.

### Renouvellement automatique du prompt d'agent

Les agents ne sont pas statiques. L'**Éditeur de directives** permet la reconfiguration d'agent en temps réel:

- Modifiez et révisez les prompts système de l'agent sans redémarrage
- Modifiez la disponibilité des outils et les paramètres de tâche à la volée
- Les modifications s'appliquent immédiatement aux conversations en cours
- Historique des directives pour suivre l'évolution de la configuration

### Gestion des outils et tâches dirigée par l'utilisateur

Les utilisateurs conservent le contrôle tout au long des opérations IA:

- **Intégration de tâches**: Créez, gérez et référencez des tâches via @mentions dans le chat
- **Sélection d'outils explicite**: Configurez les outils auxquels l'agent peut accéder
- **Liaisons bidirectionnelles**: Les tâches et les conversations restent synchronisées
- **Panneau des tâches**: Affichez, recherchez et filtrez les tâches par priorité et statut

Les utilisateurs orientent le comportement de l'agent. Les agents complètent—ne remplacent jamais—le jugement humain.

### Intégration de la base de connaissances (Panneau Bibliothèque)

L'intelligence contextuelle est unifiée et accessible:

- **Documents à double source**: Base de connaissances et uploads utilisateur dans un seul panneau
- **Aperçu polymorphe**: Markdown, PDF, Excel, Word, images et code—tous rendus en ligne
- **Métadonnées enrichies**: Catégorie, framework, niveau, source, horodatage de mise en ligne
- **Glisser-déposer**: Ajoutez instantanément des documents au chat ou au carnet
- **Continuité des pièces jointes**: Les documents restent liés aux messages pour le contexte

La connaissance n'est jamais hors de portée—elle existe dans l'espace de travail aux côtés de la conversation.

---

## 🎬 Aperçu visuel

### Architecture d'espace de travail à trois panneaux

L'espace de travail unifié intègre le chat, les artefacts et la connaissance dans un environnement coordonné:

**Mode sombre** — Ciel nocturne avec des accents technologiques brillants
![Gamen Dark Mode](screens/darkmode-default-screen.png)

**Mode clair** — Ciel diurne avec des nuages à la dérive
![Gamen Light Mode](screens/lightmode-default-screen.png)

### Carnet orienté artefacts

Chaque artefact de carnet comporte le contrôle de version, les statistiques en direct (nombre de caractères/mots, métriques d'engagement) et un contrôleur d'artefacts circulaire pour les actions rapides:

![Artifact Controller](screens/artifact-controler.png)

Les artefacts publiés suivent l'engagement avec des statistiques animées en temps réel au bas de chaque carnet.

### Renouvellement automatique du prompt d'agent

L'Éditeur de directives permet la reconfiguration d'agent dynamique sans redémarrer les conversations:

![Guideline Editor](screens/editing-guidelines-by-chat.png)

Les utilisateurs modifient les prompts système, les paramètres de tâche et les directives. Les modifications s'appliquent immédiatement aux conversations en cours, permettant l'adaptation du comportement de l'agent en temps réel.

### Intégration de la base de connaissances

Le panneau Bibliothèque unifie la connaissance IA et les uploads utilisateur avec des étiquettes de métadonnées enrichies (catégorie, canal, niveau d'expertise, source, horodatage):

![Library Panel with Metadata](screens/knowledge-base-item-hovered.png)

Les documents sont facilement accessibles par glisser-déposer vers le chat ou le carnet, gardant la connaissance contextuelle toujours à portée.

### Organisation des projets et historique du chat

La barre latérale de chat affiche les projets et les conversations organisées, permettant aux utilisateurs de grouper les chats associés et de maintenir le contexte de conversation:

![Chat History with Project Folders](screens/chat-hostory-and-project-folder-revealed.png)

### Gestion des tâches dirigée par l'utilisateur

Le modal Paramètres des tâches fournit une recherche complète de tâches, un filtrage par statut et priorité, et des descriptions de tâches détaillées avec associations de projets:

![Task Settings & Management](screens/task-settings.png)

Les utilisateurs peuvent rechercher, filtrer, marquer comme terminer, éditer ou supprimer les tâches directement dans l'espace de travail.

### Configuration explicite des outils

Le modal Paramètres des outils affiche les outils disponibles organisés par catégorie (Recherche, Stockage cloud, etc.) avec des bascules activé/désactivé et une configuration d'outils individuelle:

![Tool Settings & Configuration](screens/tool-settings.png)

Les utilisateurs choisissent explicitement les outils auxquels l'agent peut accéder, maintenant le contrôle total des capacités.

### Espace de travail collaboratif

Invitez les collaborateurs en recherchant des utilisateurs par nom, e-mail ou rôle:

![Invite Collaborators](screens/collaborators-adding.png)

Affichez et gérez les membres de l'équipe avec des informations détaillées incluant l'e-mail, le rôle et les contrôles d'adhésion:

![Member Information & Management](screens/collaborators-editing.png)

L'espace de travail prend en charge la collaboration en temps réel avec les membres de l'équipe, la gestion transparente des membres et l'organisation basée sur les rôles.

---

## ✨ Fonctionnalités

### 🗨️ Panneau de chat

- **Plusieurs sessions de chat** avec historique des messages persistant
- **Types de messages enrichis**:
  - **Réponses standard** (Markdown complet avec surlignage de syntaxe)
  - **Traces de pensée** (raisonnement étape par étape avec détails d'exécution)
  - **Journaux d'exécution d'outils** (arguments, résultats, traces d'erreur avec horodatages)
  - **Messages système** (événements collaboratifs et mises à jour de statut)
- **Modal de détails interactif** — Inspectez le raisonnement, les arguments des outils et les logs d'erreur
- **@mentions de tâches** — Référencez les tâches en ligne avec autocomplétion
- **Pièces jointes de fichiers** — Aperçu des images, documents et médias
- **Threading de réponses** — Citez et référencez des messages spécifiques
- **Basculement de thème** — Basculez entre les thèmes sombres et clairs animés

### 📝 Carnet (Éditeur d'artefacts)

- **Éditeur Markdown multi-onglets** avec modes édition/aperçu complets
- **Historique annuler/refaire** par onglet avec navigation visuelle
- **Système de publication** — Publiez des notes avec suivi d'engagement (vues, j'aime, partages)
- **Statistiques en direct** — Nombre de caractères et de mots en temps réel avec transitions animées
- **Export de téléchargement** — Enregistrez le contenu Markdown localement
- **Intégration de documents** — Faites glisser les documents dans le carnet pour les annoter
- **Support Markdown complet** — Tableaux, listes, blocs de code, surlignage de syntaxe

### 📚 Bibliothèque de documents (Panneau Connaissance)

- **Gestion des documents à double source**:
  - Documents de base de connaissances (référencés par IA)
  - Fichiers téléchargés par utilisateur (PDF, Excel, Word, images, code, texte, Markdown)
- **Support de format**:
  - **Markdown**: Rendu natif avec surlignage de syntaxe
  - **PDF**: Aperçu iframe en ligne
  - **Excel**: Conversion de tableau HTML
  - **Word**: Rendu HTML via Mammoth
  - **Images, Code, Texte**: Rendu direct avec style approprié
- **Marquage de métadonnées** — Catégorie, framework, niveau, source, heure de mise en ligne
- **Opérations de fichiers** — Télécharger, télécharger, supprimer avec glisser-déposer
- **Modal d'aperçu** — Affichage en plein écran du document

### ⚙️ Éditeur de directives (Configuration d'agent)

- Modifiez les prompts système de l'agent et les instructions
- Configurez les modèles et paramètres de tâche
- Gérez la disponibilité des outils et les paramètres
- Les modifications s'appliquent immédiatement aux conversations en cours

### 🎨 Thème et UI

- **Thèmes animés**:
  - **Sombre**: Ciel nocturne avec accents brillants et étoiles scintillantes
  - **Clair**: Ciel diurne avec nuages à la dérive
- **Mise en page multi-panneaux redimensionnable** — Contrôle professionnel des panneaux avec transitions fluides
- **Animations Framer Motion** — Ouvertures modales basées sur des ressorts, animations de compteur, chorégraphie d'icônes
- **Style personnalisé** — Effets de verre dépoli, barres de défilement personnalisées, composants sensibles au thème
- **Design réactif** — S'adapte à différentes tailles d'écran

---

## 🛠 Stack technique

**Frontend**: React 19, Vite
**Gestion d'état**: Zustand avec persistance localStorage, Redux DevTools
**Rendu**: React Markdown (GFM, surlignage de syntaxe), Mammoth (DOCX), XLSX (Excel)
**UI & Animation**: Framer Motion, react-resizable-panels, Radix UI, Tailwind CSS v4, React Icons
**Style**: Modules CSS à portée de composant avec animations avancées

---

## 🚀 Commencer

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Ouvrez `http://localhost:5173` dans votre navigateur.

**Identifiants de démonstration:**
- E-mail: `demo@example.com`
- Mot de passe: `demo123`

---

## 📁 Structure du projet

```
ai-workspace-app/
├── src/
│   ├── components/        # Composants UI
│   │   ├── ChatPanel.jsx
│   │   ├── Scratchpad.jsx
│   │   ├── DocumentPanel.jsx
│   │   ├── MessageDetailModal.jsx
│   │   ├── TasksPanel.jsx
│   │   ├── FilePreview.jsx
│   │   └── ... (autres modals et panneaux)
│   ├── store/            # Magasins Zustand
│   │   ├── useChatStore.ts
│   │   ├── useThemeStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useWorkspaceStore.ts
│   │   └── useTaskStore.ts
│   ├── types/            # Interfaces TypeScript
│   ├── utils/            # Fonctions utilitaires (détection de type de fichier, etc.)
│   ├── App.jsx           # Mise en page principale avec panneaux redimensionnables
│   ├── App.css           # Animations de thème global
│   └── index.css         # Styles de base
├── public/               # Ressources statiques
└── package.json          # Dépendances
```

---

## 💡 Philosophie de conception

Gamen est **un prototype fonctionnel explorant les paradigmes UX** pour les workflows multi-agents IA—pas une application de production. Il pose les questions:

- **Et si les artefacts étaient des citoyens de première classe?** Pas enfouis dans l'historique du chat, mais persistants et accessibles.
- **Et si les agents étaient dynamiquement reconfigurables?** Pas fixés au déploiement, mais adaptables par édition de directives.
- **Et si les utilisateurs avaient un contrôle explicite?** Pas caché derrière l'autonomie de l'agent, mais visible par la gestion des tâches et des outils.
- **Et si la connaissance était toujours accessible?** Pas dispersée dans les outils, mais unifiée dans l'espace de travail.

Ce sont des questions de conception, pas des réponses définitives. Gamen démontre une approche possible de la collaboration homme-IA.

---

## 📜 Licence

Licence MIT — Voir le fichier LICENCE pour les détails.

**Remarque**: Gamen s'inspire des concepts d'espace de travail Dione (© Projet commercial Dione). Gamen implémente ces concepts sous la licence MIT. Le nom "Dione" et la marque associée restent la propriété de leurs propriétaires respectifs.
