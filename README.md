# MiniMath - Project Setup

The project is configured with the following tools:

## 🚀 Tech Stack

- **Next.js 15** – React framework
- **TypeScript** – Typed JavaScript
- **Tailwind CSS** – Utility-first CSS framework
- **ESLint** – Linting for JavaScript/TypeScript
- **Prettier** – Code formatter
- **Jest** – Testing framework

## 📦 Installed Packages

### Runtime dependencies

- `next` – Next.js framework
- `react` – React library
- `react-dom` – React DOM bindings

### Dev dependencies

- `@types/node`, `@types/react`, `@types/react-dom` – TypeScript types
- `eslint`, `eslint-config-next` – ESLint configuration
- `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier` – Prettier integration
- `tailwindcss`, `@tailwindcss/postcss` – Tailwind CSS
- `jest`, `@testing-library/react`, `@testing-library/jest-dom` – Testing

## 🛠 Available Scripts

```bash
# Start the dev server
npm run dev

# Build for production
npm run build

# Run the production build
npm start

# Lint the code
npm run lint
npm run lint:fix

# Format the code
npm run format
npm run format:check

# Run tests
npm test
npm run test:watch
npm run test:coverage
```

## 📁 Project Structure

```
MiniMath/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── play/
│   │   │   └── [mode]/page.tsx
│   │   └── results/page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── ThemeToggle.tsx
│   ├── styles/
│   │   └── globals.css
│   └── __tests__/
│       └── page.test.tsx
├── public/
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── next.config.ts
├── postcss.config.js
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## ⚙️ Config Files

- **`.prettierrc`** – Prettier settings
- **`eslint.config.mjs`** – ESLint rules
- **`jest.config.js`** – Jest configuration
- **`tailwind.config.ts`** – Tailwind CSS configuration
- **`postcss.config.js` / `postcss.config.mjs`** – PostCSS configuration

## 🚦 Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [`http://localhost:3000`](http://localhost:3000) in your browser.

## ✅ Ready to Go

The project is fully set up and ready for development.
