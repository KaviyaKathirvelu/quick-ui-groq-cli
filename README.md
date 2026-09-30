# quick-ui-groq-cli 🚀

> Instantly generate production-ready React + Tailwind CSS components using natural language directly from your terminal, powered by Groq AI.

[![npm version](https://img.shields.io/npm/v/quick-ui-groq-cli.svg)](https://www.npmjs.com/package/quick-ui-groq-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is quick-ui?

`quick-ui-groq-cli` is a developer tool that turns plain text prompts into clean, fully-styled React components. It automatically detects your project setup (TypeScript, Next.js, Vite, Tailwind CSS) and generates production-ready code directly into your workspace.

---

## How Users Get Started

### Step 1: Get a Free Groq API Key
To use AI generation, you need a free API key:
1. Go to [console.groq.com](https://console.groq.com).
2. Sign in and create a new API key.

---

### Step 2: Save Your API Key Locally
Run this command once in your terminal to save your key securely on your machine:
```bash
npx quick-ui-groq-cli config
```

Step 3: Generate UI Components
Run the CLI from any React project folder with a description of the UI you want:
```bash
npx quick-ui-groq-cli "responsive pricing card with dark mode toggle"
```

The CLI will inspect your project, generate the code using Groq AI, format it with Prettier, and save the new component file directly in your project!

Examples & Commands
1. Basic Generation
```Bash
npx quick-ui-groq-cli "modern hero section with call to action buttons"
```

2. Custom Component Name
Specify exact file names using the --name flag:
```Bash
npx quick-ui-groq-cli "login card with email and password" --name LoginForm
```

3. Custom Output Folder
Save components into a specific directory using the --output flag:
```Bash
npx quick-ui-groq-cli "navigation bar" --output src/components/ui
```

4. Overwrite Existing Files
Use the --force flag to overwrite an existing component file without being prompted:
```Bash
npx quick-ui-groq-cli "simple button" --name Button --force
```

Command Options

<img width="857" height="200" alt="Screenshot 2026-09-30 134932" src="https://github.com/user-attachments/assets/da95089e-d049-4342-9874-b92236b9958b" />

Key Features

🧠 Auto-Stack Detection: Automatically detects .tsx vs .jsx, Next.js (App or Pages Router), Vite, and Tailwind CSS (v3 vs v4).
⚡ Lightning Fast: Generates components in sub-seconds using Groq's LLaMA 3.3 infrastructure.
🎨 Clean & Accessible: Generates self-contained components with dark mode support, WCAG AA color contrast, and inline SVGs.
🧹 Prettier Formatted: Automatically formats generated files before writing them to your disk.

License
MIT

#readme #npm #typescript #reactjs #groqai #cli #buildinpublic #hashtags #comment for more

```bash
```
npx quick-ui-groq-cli config
