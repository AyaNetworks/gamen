# Gamen (画面)

Una maqueta UI que explora el **diseño orientado a artefactos para flujos de trabajo de IA multi-agente**. Gamen demuestra cuatro paradigmas clave:

1. **Pantalla Orientada a Artefactos** — Las salidas y artefactos de IA son ciudadanos de primera clase, no chat efímero
2. **Renovación Automática de Indicaciones de Agente** — Edición dinámica de directrices para reconfiguración de agente en tiempo real
3. **Gestión de Herramientas y Tareas Dirigida por el Usuario** — Control de usuario explícito sobre la ejecución de herramientas y orquestación de tareas
4. **Integración de Base de Conocimientos** — Biblioteca de documentos unificada para inteligencia contextual

Construido con React 19, Zustand y Framer Motion. Inspirado por conceptos de espacios de trabajo Dione. Licencia MIT.

---

## 🎯 Filosofía

### Pantalla Orientada a Artefactos

El espacio de trabajo trata las salidas de IA como **artefactos persistentes**, no mensajes transitorios:

- **Trazas de Pensamiento**: Razonamiento de IA paso a paso con detalles de ejecución
- **Registros de Ejecución de Herramientas**: Argumentos de herramientas, resultados, trazas de error y marcas de tiempo
- **Artefactos Colaborativos**: Blocs de notas Markdown con control de versión y publicación
- **Conocimiento Contextual**: Biblioteca de documentos de doble origen (base de conocimientos + cargas de usuario)

Cada artefacto permanece visible y accesible dentro del mismo espacio de trabajo, creando contexto persistente.

### Renovación Automática de Indicaciones de Agente

Los agentes no son estáticos. El **Editor de Directrices** permite la reconfiguración de agente en tiempo real:

- Edite y revise los indicadores del sistema del agente sin reiniciar
- Modifique la disponibilidad de herramientas y parámetros de tareas al instante
- Los cambios se aplican inmediatamente a las conversaciones en curso
- Historial de directrices para realizar un seguimiento de la evolución de la configuración

### Gestión de Herramientas y Tareas Dirigida por el Usuario

Los usuarios mantienen el control en todas las operaciones de IA:

- **Integración de Tareas**: Crear, gestionar y referenciar tareas a través de @mentions en el chat
- **Selección Explícita de Herramientas**: Configure qué herramientas puede acceder el agente
- **Vinculación Bidireccional**: Las tareas y conversaciones permanecen sincronizadas
- **Panel de Tareas**: Ver, buscar y filtrar tareas por prioridad y estado

Los usuarios guían el comportamiento del agente. Los agentes aumentan—nunca reemplazan—el juicio humano.

### Integración de Base de Conocimientos (Panel de Biblioteca)

La inteligencia contextual está unificada y accesible:

- **Documentos de Doble Origen**: Base de conocimientos y cargas de usuario en un único panel
- **Vista Previa Polimorfa**: Markdown, PDF, Excel, Word, imágenes y código—todo renderizado en línea
- **Metadatos Enriquecidos**: Categoría, marco, nivel, origen, marca de tiempo de carga
- **Arrastrar y Soltar**: Agregue instantáneamente documentos al chat o al bloc de notas
- **Continuidad de Archivos Adjuntos**: Los documentos permanecen vinculados a los mensajes para el contexto

El conocimiento nunca está fuera de alcance—vive en el espacio de trabajo junto con la conversación.

---

## 🎬 Resumen Visual

### Arquitectura de Espacio de Trabajo de Tres Paneles

El espacio de trabajo unificado integra chat, artefactos y conocimiento de manera fluida en un entorno coordinado:

**Modo Oscuro** — Cielo nocturno con acentos tecnológicos brillantes
![Gamen Dark Mode](screens/darkmode-default-screen.png)

**Modo Claro** — Cielo diurno con nubes a la deriva
![Gamen Light Mode](screens/lightmode-default-screen.png)

### Bloc de Notas Orientado a Artefactos

Cada artefacto de bloc de notas presenta control de versión, estadísticas en vivo (conteo de caracteres/palabras, métricas de participación) y un controlador de artefactos circular para acciones rápidas:

![Artifact Controller](screens/artifact-controler.png)

Los artefactos publicados rastrean la participación con estadísticas animadas en tiempo real en la parte inferior de cada bloc de notas.

### Renovación Automática de Indicaciones de Agente

El Editor de Directrices permite la reconfiguración dinámica del agente sin reiniciar conversaciones:

![Guideline Editor](screens/editing-guidelines-by-chat.png)

Los usuarios editan indicadores del sistema, parámetros de tareas y directrices. Los cambios se aplican inmediatamente a las conversaciones en curso, permitiendo la adaptación del comportamiento del agente en tiempo real.

### Integración de Base de Conocimientos

El panel Biblioteca unifica el conocimiento de IA y las cargas de usuario con etiquetado de metadatos enriquecidos (categoría, canal, nivel de experiencia, origen, marca de tiempo):

![Library Panel with Metadata](screens/knowledge-base-item-hovered.png)

Los documentos son fácilmente accesibles mediante arrastrar y soltar al chat o al bloc de notas, manteniendo la inteligencia contextual siempre al alcance.

### Organización de Proyectos e Historial de Chat

La barra lateral de chat revela proyectos y conversaciones organizadas, permitiendo a los usuarios agrupar chats relacionados y mantener el contexto de conversación:

![Chat History with Project Folders](screens/chat-hostory-and-project-folder-revealed.png)

### Gestión de Tareas Dirigida por el Usuario

El modal Configuración de Tareas proporciona búsqueda completa de tareas, filtrado por estado y prioridad, y descripciones de tareas detalladas con asociaciones de proyectos:

![Task Settings & Management](screens/task-settings.png)

Los usuarios pueden buscar, filtrar, marcar como completadas, editar o eliminar tareas directamente dentro del espacio de trabajo.

### Configuración Explícita de Herramientas

El modal Configuración de Herramientas muestra herramientas disponibles organizadas por categoría (Búsqueda, Almacenamiento en la Nube, etc.) con alternancias de habilitación/deshabilitación y configuración de herramientas individuales:

![Tool Settings & Configuration](screens/tool-settings.png)

Los usuarios eligen explícitamente a qué herramientas puede acceder el agente, manteniendo el control total de las capacidades.

### Espacio de Trabajo Colaborativo

Invite colaboradores buscando usuarios por nombre, correo electrónico o rol:

![Invite Collaborators](screens/collaborators-adding.png)

Vea y administre miembros del equipo con información detallada incluyendo correo electrónico, rol y controles de membresía:

![Member Information & Management](screens/collaborators-editing.png)

El espacio de trabajo admite colaboración en tiempo real con miembros del equipo, gestión transparente de miembros y organización basada en roles.

---

## ✨ Características

### 🗨️ Panel de Chat

- **Múltiples sesiones de chat** con historial de mensajes persistente
- **Tipos de mensajes enriquecidos**:
  - **Respuestas estándar** (Markdown completo con resaltado de sintaxis)
  - **Trazas de pensamiento** (razonamiento paso a paso con detalles de ejecución)
  - **Registros de ejecución de herramientas** (argumentos, resultados, trazas de error con marcas de tiempo)
  - **Mensajes del sistema** (eventos colaborativos y actualizaciones de estado)
- **Modal de detalles interactivo** — Inspeccione razonamiento, argumentos de herramientas y registros de error
- **@mentions de tareas** — Tareas de referencia en línea con autocompletar
- **Archivos adjuntos** — Vista previa de imágenes, documentos y medios
- **Subprocesos de respuesta** — Citar y hacer referencia a mensajes específicos
- **Alternancia de tema** — Cambiar entre temas claros y oscuros animados

### 📝 Bloc de Notas (Editor de Artefactos)

- **Editor Markdown multi-pestaña** con modos de edición/vista previa completos
- **Historial de deshacer/rehacer** por pestaña con navegación visual
- **Sistema de publicación** — Publicar notas con seguimiento de participación (vistas, me gusta, compartir)
- **Estadísticas en vivo** — Conteo de caracteres y palabras en tiempo real con transiciones animadas
- **Exportación de descarga** — Guarde el contenido de Markdown localmente
- **Integración de documentos** — Arrastre documentos al bloc de notas para anotar
- **Soporte Markdown completo** — Tablas, listas, bloques de código, resaltado de sintaxis

### 📚 Biblioteca de Documentos (Panel de Conocimientos)

- **Gestión de documentos de doble origen**:
  - Documentos de base de conocimientos (referenciados por IA)
  - Archivos cargados por el usuario (PDF, Excel, Word, imágenes, código, texto, Markdown)
- **Soporte de formato**:
  - **Markdown**: Renderizado nativo con resaltado de sintaxis
  - **PDF**: Vista previa de iframe en línea
  - **Excel**: Conversión de tabla HTML
  - **Word**: Renderizado HTML a través de Mammoth
  - **Imágenes, Código, Texto**: Renderizado directo con estilo apropiado
- **Etiquetado de metadatos** — Categoría, marco, nivel, origen, hora de carga
- **Operaciones de archivo** — Cargar, descargar, eliminar con arrastrar y soltar
- **Modal de vista previa** — Visualización de documento en pantalla completa

### ⚙️ Editor de Directrices (Configuración de Agente)

- Edite indicadores del sistema del agente e instrucciones
- Configure plantillas de tareas y parámetros
- Gestione la disponibilidad de herramientas y configuración
- Los cambios se aplican inmediatamente a las conversaciones en curso

### 🎨 Tema e Interfaz de Usuario

- **Temas animados**:
  - **Oscuro**: Cielo nocturno con acentos brillantes y estrellas parpadeantes
  - **Claro**: Cielo diurno con nubes a la deriva
- **Diseño multi-panel redimensionable** — Control profesional de paneles con transiciones suaves
- **Animaciones de Framer Motion** — Aperturas de modal basadas en muelles, animaciones de contador, coreografía de iconos
- **Estilo personalizado** — Efectos de vidrio esmerilado, barras de desplazamiento personalizadas, componentes conscientes del tema
- **Diseño receptivo** — Se adapta a diferentes tamaños de pantalla

---

## 🛠 Pila Tecnológica

**Frontend**: React 19, Vite
**Gestión de Estado**: Zustand con persistencia localStorage, Redux DevTools
**Renderizado**: React Markdown (GFM, resaltado de sintaxis), Mammoth (DOCX), XLSX (Excel)
**Interfaz de Usuario y Animación**: Framer Motion, react-resizable-panels, Radix UI, Tailwind CSS v4, React Icons
**Estilo**: Módulos CSS de alcance de componente con animaciones avanzadas

---

## 🚀 Empezando

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abra `http://localhost:5173` en su navegador.

**Credenciales de Demostración:**
- Correo electrónico: `demo@example.com`
- Contraseña: `demo123`

---

## 📁 Estructura del Proyecto

```
ai-workspace-app/
├── src/
│   ├── components/        # Componentes UI
│   │   ├── ChatPanel.jsx
│   │   ├── Scratchpad.jsx
│   │   ├── DocumentPanel.jsx
│   │   ├── MessageDetailModal.jsx
│   │   ├── TasksPanel.jsx
│   │   ├── FilePreview.jsx
│   │   └── ... (otros modales y paneles)
│   ├── store/            # Tiendas Zustand
│   │   ├── useChatStore.ts
│   │   ├── useThemeStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useWorkspaceStore.ts
│   │   └── useTaskStore.ts
│   ├── types/            # Interfaces TypeScript
│   ├── utils/            # Funciones de utilidad (detección de tipo de archivo, etc.)
│   ├── App.jsx           # Diseño principal con paneles redimensionables
│   ├── App.css           # Animaciones de tema global
│   └── index.css         # Estilos base
├── public/               # Activos estáticos
└── package.json          # Dependencias
```

---

## 💡 Filosofía de Diseño

Gamen es **un prototipo funcional que explora paradigmas UX** para flujos de trabajo de IA multi-agente—no una aplicación de producción. Plantea las preguntas:

- **¿Y si los artefactos fueran ciudadanos de primera clase?** No enterrados en el historial de chat, sino persistentes y accesibles.
- **¿Y si los agentes fueran dinámicamente reconfigurables?** No fijos en la implementación, sino adaptables mediante la edición de directrices.
- **¿Y si los usuarios tuvieran control explícito?** No ocultos detrás de la autonomía del agente, sino visibles a través de la gestión de tareas y herramientas.
- **¿Y si el conocimiento siempre fuera accesible?** No disperso en herramientas, sino unificado en el espacio de trabajo.

Estas son preguntas de diseño, no respuestas definitivas. Gamen demuestra un enfoque posible para la colaboración hombre-IA.

---

## 📜 Licencia

Licencia MIT — Consulte el archivo LICENCIA para más detalles.

**Nota**: Gamen está inspirado en conceptos de espacios de trabajo Dione (© Proyecto comercial Dione). Gamen implementa estos conceptos bajo la Licencia MIT. El nombre "Dione" y la marca asociada son propiedad de sus respectivos propietarios.
