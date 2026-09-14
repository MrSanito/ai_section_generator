# AI Section Generator & Live Editor

An intelligent UI section generator and live visual editor built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, and **DaisyUI 5**. Features a modern chat interface inspired by local LLM tools, allowing you to generate, inspect, and customize web sections through conversational prompts.

---

## ✨ Features

- **💬 Conversational UI Generation**: Chat-based prompt interface with session management, quick suggestions, and live synthesis.
- **⏳ Realistic Synthesis Animation**: 1.8-second simulated AI generation loading state with animated progress feedback before sections appear.
- **💾 Automatic LocalStorage Persistence**: All chat sessions, messages, generated layouts, and theme preferences persist locally across page refreshes.
- **🎨 Dynamic Recursive Element Tree**: Generates semantic JSON layout structures rendered by `DynamicNodeRenderer` (pricing, SaaS hero, feature grids, CTA banners, etc.).
- **✏️ Live Inline Text Editing**: Click directly on any text inside the rendered canvas to edit content in real time.
- **📱 Responsive Viewport Switcher**: Test how generated sections look on Desktop (`100%`), Tablet (`768px`), and Mobile (`390px`).
- **⏪ Undo & Redo History**: Complete state history stack for rollbacks and reapplying inline edits.
- **🔍 Live JSON Tree Inspector**: Modal to view, copy, and download the underlying nested JSON hierarchy.
- **🌓 Light & Dark Theme**: Toggle between light and dark visual modes with warm `#E8823C` orange accents.
- **🗄️ Backend Mock Storage**: Built-in API endpoints (`/api/generate`, `/api/save`, `/api/saved`) with file-backed persistence.

---

## 🚀 Local Setup & Installation

Follow these steps to run the application locally on your machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v18.18.0 or later (Node.js 20+ recommended)
- **Package Manager**: `npm` (comes with Node.js), `pnpm`, `yarn`, or `bun`

Verify your Node version:
```bash
node -v
npm -v
```

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/MrSanito/ai_section_generator.git
cd ai-section-generator
```

---

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

> **Note**: If you have a slow internet connection, please allow 2–3 minutes for all packages to finish installing.

---

### Step 3: Run the Development Server

Start the local development server with Turbopack:

```bash
npm run dev
```

The application will start at:
```text
http://localhost:3000
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the app.

---

### Step 4: Build for Production (Optional)

To test the production build locally:

```bash
# Compile optimized production bundle and check TypeScript
npm run build

# Start the production server
npm start
```

---

## 📁 Project Structure

```text
ai-section-generator/
├── app/
│   ├── api/
│   │   ├── generate/route.ts   # Keyword matching & layout generator API
│   │   ├── save/route.ts       # Backend save endpoint
│   │   └── saved/route.ts      # Fetch saved section record endpoint
│   ├── favicon.ico
│   ├── globals.css             # Tailwind v4 & DaisyUI styles
│   ├── layout.tsx              # Root Next.js layout & fonts
│   └── page.tsx                # Main Chat & Live Editor Application
├── components/
│   ├── DynamicNodeRenderer.tsx # Recursive JSON UI element tree renderer
│   ├── EditableText.tsx        # Inline editable text component
│   ├── JsonInspectorModal.tsx  # Modal for viewing & exporting raw JSON
│   └── llm.tsx                 # Standalone Local LLM chat UI component
├── data/
│   ├── saved-section.json      # Mock persistent file database
│   └── templates/              # Predefined section layout templates
├── lib/
│   ├── storage.ts              # Server-side file storage utilities
│   ├── treeUtils.ts            # Tree traversal, cloning & immutability helpers
│   └── utils.ts                # Class merging utility (clsx + tailwind-merge)
├── types/
│   └── section.ts              # TypeScript interfaces for nodes & API payloads
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16 (App Router)** | Framework with React Server Components and Turbopack |
| **React 19** | Core UI library |
| **Tailwind CSS v4** | Utility-first CSS styling |
| **DaisyUI 5** | Semantic Tailwind component library |
| **TypeScript 5** | Strict type safety and schema validation |
| **Lucide React** | Icons |

---

## 📡 API Endpoints

- **`POST /api/generate`**: Accepts `{ prompt: string }` and returns `{ success: true, layoutType, matchedKeyword, data: UIElementNode }`.
- **`POST /api/save`**: Accepts `{ layout, prompt }` and stores versioned section records.
- **`GET /api/saved`**: Retrieves the latest saved section record.

---

## 💡 Quick Tips

- **Try Suggestions**: Click any of the 4 suggestion cards on the welcome screen to test instant section synthesis.
- **Inline Text Editing**: Hover over any heading, paragraph, or button in the canvas and click to edit text inline.
- **Multiple Chats**: Click **+ New Chat** in the sidebar to create independent sessions, all saved to `localStorage`.
- **Theme**: Click the theme dropdown in the top bar to switch between Light and Dark modes.
