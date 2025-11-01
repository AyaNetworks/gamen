# Gamen (画面)

Ein UI-Mockup zur Erkundung des **Artifact-First-Design für Multi-Agent-AI-Workflows**. Gamen demonstriert vier Kernparadigmen:

1. **Artifact-First Screen** — KI-Ausgaben und Artefakte sind First-Class Citizens, nicht ephemere Chats
2. **Automatische Agenten-Prompt-Erneuerung** — Dynamische Richtlinienbearbeitung für Echtzeit-Agent-Neukonfiguration
3. **Benutzergesteuerte Tools & Task-Verwaltung** — Explizite Benutzerkontrolle über Tool-Ausführung und Task-Orchestrierung
4. **Knowledge-Base-Integration** — Einheitliche Dokumentbibliothek für kontextbewusste Intelligenz

Gebaut mit React 19, Zustand und Framer Motion. Inspiriert von Diones Workspace-Konzepten. MIT License.

---

## 🎯 Philosophie

### Artifact-First Screen

Der Workspace behandelt KI-Ausgaben als **persistente Artefakte**, nicht als flüchtige Nachrichten:

- **Denk-Spuren**: Schrittweise KI-Reasoning mit Ausführungsdetails
- **Tool-Ausführungsprotokolle**: Tool-Argumente, Ergebnisse, Fehler-Traces und Zeitstempel
- **Kollaborative Artefakte**: Markdown-Scratchpads mit Versionskontrolle und Publishing
- **Kontextbewusstes Wissen**: Dual-Source-Dokumentbibliothek (Wissensdatenbank + Benutzer-Uploads)

Jedes Artefakt bleibt sichtbar und zugänglich im selben Workspace und schafft persistenten Kontext.

### Automatische Agenten-Prompt-Erneuerung

Agenten sind nicht statisch. Der **Guideline Editor** ermöglicht Echtzeit-Agent-Neukonfiguration:

- Bearbeiten und überprüfen Sie Agent-Systemprompts ohne Neustart
- Ändern Sie Tool-Verfügbarkeit und Task-Parameter spontan
- Änderungen gelten sofort in laufenden Gesprächen
- Richtlinien-Verlauf zur Verfolgung der Konfigurationsevolution

### Benutzergesteuerte Tools & Task-Verwaltung

Benutzer behalten die Kontrolle über alle KI-Operationen:

- **Task-Integration**: Erstellen, verwalten und referenzieren Sie Tasks via @mentions im Chat
- **Explizite Tool-Auswahl**: Konfigurieren Sie, welche Tools der Agent access hat
- **Bidirektionale Verlinkung**: Tasks und Gespräche bleiben synchronisiert
- **Task-Panel**: Anzeigen, suchen und filtern Sie Tasks nach Priorität und Status

Benutzer lenken das Agent-Verhalten. Agenten ergänzen—ersetzen nie—menschliches Urteilsvermögen.

### Knowledge-Base-Integration (Library Panel)

Kontextbewusste Intelligenz ist einheitlich und zugänglich:

- **Dual-Source-Dokumente**: Wissensdatenbank und Benutzer-Uploads in einem Panel
- **Polymorphe Vorschau**: Markdown, PDF, Excel, Word, Bilder und Code—alles inline gerendert
- **Rich Metadata**: Kategorie, Framework, Level, Quelle, Upload-Zeitstempel
- **Drag-and-Drop**: Fügen Sie sofort Dokumente zu Chat oder Scratchpad hinzu
- **Anhang-Kontinuität**: Dokumente bleiben mit Nachrichten verlinkt

Wissen ist nie unerreichbar—es lebt im Workspace neben der Konversation.

---

## 🎬 Visuelle Übersicht

### Drei-Panel-Workspace-Architektur

Der einheitliche Workspace integriert Chat, Artefakte und Wissen nahtlos in einer koordinierten Umgebung:

**Dark Mode** — Nachthimmel mit leuchtenden Tech-Akzenten
![Gamen Dark Mode](screens/darkmode-default-screen.png)

**Light Mode** — Taghimmel mit treibenden Wolken
![Gamen Light Mode](screens/lightmode-default-screen.png)

### Artifact-First Scratchpad

Jedes Scratchpad-Artefakt verfügt über Versionskontrolle, Live-Statistiken (Zeichen-/Wortanzahl, Engagement-Metriken) und einen kreisförmigen Artefakt-Controller für schnelle Aktionen:

![Artifact Controller](screens/artifact-controler.png)

Veröffentlichte Artefakte verfolgen das Engagement mit animierten Echtzeit-Statistiken am unteren Rand jedes Scratchpads.

### Automatische Agenten-Prompt-Erneuerung

Der Guideline Editor ermöglicht dynamische Agent-Neukonfiguration ohne Konversationen neu zu starten:

![Guideline Editor](screens/editing-guidelines-by-chat.png)

Benutzer bearbeiten Systemprompts, Task-Parameter und Richtlinien. Änderungen gelten sofort in laufenden Gesprächen, was Echtzeit-Agent-Verhaltensanpassung ermöglicht.

### Knowledge-Base-Integration

Das Library-Panel vereinheitlicht KI-Wissen und Benutzer-Uploads mit Rich-Metadata-Tagging (Kategorie, Kanal, Expertisen-Level, Quelle, Zeitstempel):

![Library Panel with Metadata](screens/knowledge-base-item-hovered.png)

Dokumente sind leicht per Drag-and-Drop zu Chat oder Scratchpad zugänglich, während kontextbewusstes Wissen immer erreichbar bleibt.

### Projekt-Organisation & Chat-Verlauf

Die Chat-Seitenleiste zeigt Projekte und organisierte Gespräche, so dass Benutzer verwandte Chats gruppieren und Gesprächskontext beibehalten können:

![Chat History with Project Folders](screens/chat-hostory-and-project-folder-revealed.png)

### Benutzergesteuerte Task-Verwaltung

Das Task-Settings-Modal bietet umfassende Task-Suche, Filterung nach Status und Priorität sowie detaillierte Task-Beschreibungen mit Projekt-Zuordnungen:

![Task Settings & Management](screens/task-settings.png)

Benutzer können Tasks direkt im Workspace suchen, filtern, als erledigt markieren, bearbeiten oder löschen.

### Explizite Tool-Konfiguration

Das Tool-Settings-Modal zeigt verfügbare Tools nach Kategorien (Suche, Cloud Storage usw.) organisiert mit Ein-/Ausschaltern und individueller Tool-Konfiguration:

![Tool Settings & Configuration](screens/tool-settings.png)

Benutzer wählen explizit, auf welche Tools der Agent access hat, und behalten volle Kontrolle über Fähigkeiten.

### Kollaborativer Workspace

Laden Sie Kollaboratoren ein, indem Sie nach Benutzern nach Name, E-Mail oder Rolle suchen:

![Invite Collaborators](screens/collaborators-adding.png)

Zeigen und verwalten Sie Teammitglieder mit detaillierten Informationen einschließlich E-Mail, Rolle und Mitgliedschaftskontrolle:

![Member Information & Management](screens/collaborators-editing.png)

Der Workspace unterstützt Echtzeit-Zusammenarbeit mit Teammitgliedern, transparente Mitgliedsverwaltung und rollenbasierte Organisation.

---

## ✨ Features

### 🗨️ Chat-Panel

- **Mehrere Chat-Sessions** mit persistentem Nachrichtenverlauf
- **Rich-Message-Typen**:
  - **Standard-Antworten** (vollständiges Markdown mit Syntax-Highlighting)
  - **Denk-Spuren** (schrittweise Reasoning mit Ausführungsdetails)
  - **Tool-Ausführungsprotokolle** (Argumente, Ergebnisse, Fehler-Traces mit Zeitstempeln)
  - **Systemnachrichten** (Kollaborations-Events und Status-Updates)
- **Interaktives Detail-Modal** — Inspizieren Sie Reasoning, Tool-Argumente und Error-Logs
- **Task @mentions** — Referenzieren Sie Tasks inline mit Autocompletion
- **Datei-Anhänge** — Vorschau von Bildern, Dokumenten und Medien
- **Reply-Threading** — Zitieren und referenzieren Sie spezifische Nachrichten
- **Theme-Umschalter** — Wechseln Sie zwischen animiertem dunklem und hellem Theme

### 📝 Scratchpad (Artifact Editor)

- **Multi-Tab Markdown-Editor** mit vollständigen Edit-/Preview-Modi
- **Undo/Redo-Verlauf** pro Tab mit visueller Navigation
- **Publishing-System** — Veröffentlichen Sie Notizen mit Engagement-Tracking (Views, Likes, Shares)
- **Live-Statistiken** — Echtzeit-Zeichen- und Wortanzahl mit animierten Übergängen
- **Download-Export** — Speichern Sie Markdown-Inhalte lokal
- **Dokument-Integration** — Ziehen Sie Dokumente ins Scratchpad zum Annotieren
- **Vollständige Markdown-Unterstützung** — Tabellen, Listen, Code-Blöcke, Syntax-Highlighting

### 📚 Document Library (Knowledge Panel)

- **Dual-Source-Dokumentverwaltung**:
  - Knowledge-Base-Dokumente (KI-referenziert)
  - Benutzer-Upload-Dateien (PDF, Excel, Word, Bilder, Code, Text, Markdown)
- **Format-Unterstützung**:
  - **Markdown**: Natives Rendering mit Syntax-Highlighting
  - **PDF**: Inline-iframe-Vorschau
  - **Excel**: HTML-Tabellenkonvertierung
  - **Word**: HTML-Rendering via Mammoth
  - **Bilder, Code, Text**: Direktes Rendering mit angemessenem Styling
- **Metadata-Tagging** — Kategorie, Framework, Level, Quelle, Upload-Zeit
- **Datei-Operationen** — Upload, Download, Löschen mit Drag-and-Drop
- **Preview-Modal** — Vollbild-Dokumentanzeige

### ⚙️ Guideline Editor (Agent-Konfiguration)

- Bearbeiten Sie Agent-Systemprompts und Anweisungen
- Konfigurieren Sie Task-Templates und Parameter
- Verwalten Sie Tool-Verfügbarkeit und Einstellungen
- Änderungen gelten sofort in laufenden Gesprächen

### 🎨 Theming & UI

- **Animierte Themes**:
  - **Dark**: Nachthimmel mit leuchtenden Akzenten und funkelnden Sternen
  - **Light**: Taghimmel mit treibenden Wolken
- **Resizable Multi-Panel Layout** — Professionelle Panel-Kontrolle mit sanften Übergängen
- **Framer Motion Animationen** — Spring-basierte Modal-Öffnungen, Counter-Animationen, Icon-Choreografie
- **Custom Styling** — Frosted-Glass-Effekte, custom Scrollbars, Theme-aware Components
- **Responsive Design** — Passt sich verschiedenen Bildschirmgrößen an

---

## 🛠 Tech Stack

**Frontend**: React 19, Vite
**State Management**: Zustand mit localStorage Persistierung, Redux DevTools
**Rendering**: React Markdown (GFM, Syntax-Highlighting), Mammoth (DOCX), XLSX (Excel)
**UI & Animation**: Framer Motion, react-resizable-panels, Radix UI, Tailwind CSS v4, React Icons
**Styling**: Component-scoped CSS Module mit erweiterten Animationen

---

## 🚀 Erste Schritte

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffnen Sie `http://localhost:5173` in Ihrem Browser.

**Demo-Anmeldedaten:**
- E-Mail: `demo@example.com`
- Passwort: `demo123`

---

## 📁 Projektstruktur

```
ai-workspace-app/
├── src/
│   ├── components/        # UI-Komponenten
│   │   ├── ChatPanel.jsx
│   │   ├── Scratchpad.jsx
│   │   ├── DocumentPanel.jsx
│   │   ├── MessageDetailModal.jsx
│   │   ├── TasksPanel.jsx
│   │   ├── FilePreview.jsx
│   │   └── ... (weitere Modals und Panels)
│   ├── store/            # Zustand Stores
│   │   ├── useChatStore.ts
│   │   ├── useThemeStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useWorkspaceStore.ts
│   │   └── useTaskStore.ts
│   ├── types/            # TypeScript-Interfaces
│   ├── utils/            # Utility-Funktionen (Dateityp-Erkennung usw.)
│   ├── App.jsx           # Haupt-Layout mit resizable Panels
│   ├── App.css           # Globale Theme-Animationen
│   └── index.css         # Basis-Styles
├── public/               # Statische Assets
└── package.json          # Abhängigkeiten
```

---

## 💡 Design-Philosophie

Gamen ist **ein funktionierendes Prototyp zur Erkundung von UX-Paradigmen** für Multi-Agent-AI-Workflows—keine Produktionsanwendung. Es stellt die Fragen:

- **Was wenn Artefakte First-Class Citizens wären?** Nicht in Chat-Verlauf begraben, sondern persistent und zugänglich.
- **Was wenn Agenten dynamisch rekonfigurierbar wären?** Nicht beim Deployment fixiert, sondern adaptierbar durch Richtlinien-Bearbeitung.
- **Was wenn Benutzer explizite Kontrolle hätten?** Nicht verborgen hinter Agent-Autonomie, sondern sichtbar durch Task- und Tool-Verwaltung.
- **Was wenn Wissen immer zugänglich wäre?** Nicht über Tools verstreut, sondern vereinheitlicht im Workspace.

Dies sind Design-Fragen, keine endgültigen Antworten. Gamen demonstriert einen möglichen Ansatz zur Mensch-KI-Kollaboration.

---

## 📜 Lizenz

MIT License — Siehe LICENSE-Datei für Details.

**Hinweis**: Gamen ist inspiriert von Dione Workspace-Konzepten (© Dione Kommerzielles Projekt). Gamen implementiert diese Konzepte unter MIT License. Der Name "Dione" und zugehörige Branding bleiben Eigentum ihrer jeweiligen Besitzer.
