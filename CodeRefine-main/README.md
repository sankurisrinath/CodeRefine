# CodeRefine

**AI-Powered Code Review & Optimization Engine** — A modern frontend built with React, Vite, Tailwind CSS, and Monaco Editor that provides AI-powered code analysis with confidence scoring.

## Features

- 🤖 **AI Analysis**: Bug detection, performance optimization, security checks
- 📊 **Confidence Scoring**: Radial chart showing analysis confidence
- 🎨 **Dark Futuristic UI**: Glassmorphism design with blue/purple gradients
- 🔤 **Monaco Editor**: Full-featured code editor with syntax highlighting
- 📱 **Fully Responsive**: Mobile, tablet, and desktop ready
- ⚡ **Smooth Animations**: Framer Motion micro-interactions

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| @monaco-editor/react | Code editor |
| Framer Motion | Animations |
| Recharts | Confidence visualization |
| React Router | Page navigation |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd CodeRefine

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
CodeRefine/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Architecture.jsx
│   │   ├── CTA.jsx
│   │   ├── Footer.jsx
│   │   ├── CodeEditor.jsx
│   │   ├── ResultsPanel.jsx
│   │   ├── IssueCard.jsx
│   │   ├── ConfidenceChart.jsx
│   │   ├── OptimizedCodeView.jsx
│   │   ├── SeverityBadge.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── TabButton.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   └── ToolPage.jsx
│   ├── data/
│   │   └── mockData.js
│   └── utils/
│       └── helpers.js
```

## Pages

- **`/`** — Landing page with hero, features, how it works, architecture, and CTA sections
- **`/tool`** — Interactive code analysis tool with Monaco editor and tabbed results

## Supported Languages

- Python
- Java
- C++
