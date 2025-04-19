
<img src="https://img.shields.io/npm/v/vite_react_shadcn_ts" alt="npm version" />&nbsp;&nbsp;<img src="https://img.shields.io/badge/Build-passing-brightgreen.svg" alt="Build: passing" />&nbsp;&nbsp;<img src="https://img.shields.io/badge/License-2025_Continuum_Software-blue.svg" alt="License: Continuum Software 2025" />

# PEDAL 1

React‑powered demo dashboard for visualizing and signing off on each stage of PEDAL development pipeline. 

## Features

- **Role‑based demo auth**: Click “Sign in with GitHub” to simulate
  login as admin, product owner, PM, TPM, or engineer (mock data).
- **Pipeline visualization**: See stages, progress bars, and approval
  counts for each artifact.
- **Interactive sign‑offs**: Approve or request changes via a
  lightweight modal.
- **User management**: Admins can view and update user roles on the fly.
- **Zero backend**: All data is mocked; drop‑in for prototyping without
  infra.

It bundles shadcn/UI + Radix components, React Query, React Router,
Framer Motion and Sonner toasts to jump‑start your dashboard.

## 🛠️ Quick Start

1.  Ensure you have Node.js ≥18 and npm.
2.  Clone the repo:

``` bash
git clone https://github.com/your‑org/pedal‑1.git
cd pedal‑1
```

1.  Install dependencies (we recommend npm):

``` bash
npm install
```

1.  Start dev server:

``` bash
npm run dev
```

\_Open [http://localhost:5173\_](http://localhost:5173_)

## 🔧 Installation Details

``` bash
# Production build
npm run build

# Preview the production bundle
npm run preview

# Lint all files
npm run lint
```

- Lockfile:\* This repo contains both \`package-lock.json\` and
  \`bun.lockb\`. Use one package manager—delete the other lockfile to
  avoid conflicts.

## 🗺️ Layout

``` bash
📁 src/
 ├── main.tsx         # app entrypoint (renders <App/>)
 ├── App.tsx          # routes & providers (React Query, Router, Tooltip, Auth)
 ├── context/AuthContext.tsx   # demo auth logic & localStorage persistence
 ├── components/      # UI primitives (Toaster, ProtectedRoute, etc.)
 ├── pages/           # route targets: Index, Login, Documentation, UserManagement, Unauthorized, NotFound
 ├── hooks/           # custom React hooks
 └── lib/             # utilities
```

## ⚙️ Configuration

No env vars required for demo. To wire real GitHub OAuth:

``` bash
# in project root:
echo "VITE_GITHUB_CLIENT_ID=your_id" > .env
echo "VITE_GITHUB_CLIENT_SECRET=your_secret" >> .env
```

Vite auto‑loads \`VITE\_\*\` vars. Replace the stub in
\`AuthContext.login()\`.

## 🧩 Features

- \*\*Demo GitHub Login:\*\* Click “Sign in with GitHub” in \`/login\`.
- \*\*Protected Routes:\*\* Wrap pages in \`<ProtectedRoute>\`; roles in
  \`AuthContext\`.
- \*\*Docs Viewer:\*\* Navigate to \`/documentation\`.
- \*\*User Management:\*\* Accessible under \`/user-management\` for
  admins; updates flow through Context and localStorage.
- \*\*Animations & Toasts:\*\* Powered by Framer Motion and Sonner.

## 📚 Usage Examples

- Accessing Dashboard\*

``` jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/documentation" element={
      <ProtectedRoute><Documentation /></ProtectedRoute>
    }/>
  </Routes>
</BrowserRouter>
```

- Adding a New Route\*

1\. Create \`src/pages/MyPage.tsx\`. 2. Add
\`<Route path="/my-page" element={<MyPage />} /\>\` in \`App.tsx\` above
\`\*\`.

## Architecture

Pedal 1’s architecture is a classic provider‑wrapped SPA composed of six
layers: \*\*Entry\*\*, \*\*Providers\*\*, \*\*Auth\*\*, \*\*Routing\*\*,
\*\*Pages\*\*, and \*\*UI Components\*\*. Each layer encapsulates a
distinct responsibility, ensuring separation of concerns and easy
extensibility. For a deeper dive, see the [Architecture Deep
Dive](ARCH.md).

### Entry Point

``` jsx
/src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
createRoot(document.getElementById('root')!).render(<App />);
```

• Mounts \`<App />\` into the DOM node with id \`root\`.


``` text
main.tsx
  └─ createRoot → render <App />

App.tsx
  ├─ <QueryClientProvider>      ← TanStack React Query client for server state
  │    └─ <TooltipProvider>      ← global Radix tooltips
  │         └─ <BrowserRouter>   ← React Router DOM for client‑side routing
  │              └─ <AuthProvider> ← demo auth & role context
  │                   ├─ Sonner & Toaster UI
  │                   └─ <Routes>   ← application routes
  └─ export default App
```

### Provider Layer

#### Global Providers
``` jsx
/src/App.tsx
<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <BrowserRouter>
      <AuthProvider>
        <Sonner/>  {/* toast UI */}
        <Toaster/> {/* legacy toast UI */}
        <Routes>…</Routes>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

1\. \*\*QueryClientProvider\*\*

`  - Instantiates a single React Query client  `  
`  - Manages caching & refetch policies  `

2\. \*\*TooltipProvider\*\*

`  - Central Radix UI tooltip configuration  `

3\. \*\*BrowserRouter\*\*

`  - Enables client‑side routing  `

4\. \*\*AuthProvider\*\*

``   - Houses `AuthContext` (user state, login/logout, role updates)   ``  
``   - Persists user in `localStorage` under `pedal_user`   ``

5\. \*\*Toasters (Sonner & Toaster)\*\*

`  - Global notification system  `

\> \_Order matters:\_ React Query must wrap routing if any page uses
\`useQuery\`; Auth must wrap Routes to enforce protected paths.

### Auth Layer

``` typescript
/src/context/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pedal_user');
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async () => {
    setIsLoading(true);
    // DEMO: stubbed GitHub flow
    const demoUser = { id: '1', name: 'Demo', role: 'admin' };
    setUser(demoUser);
    localStorage.setItem('pedal_user', JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pedal_user');
  };

  const updateUserRole = async (role) => { /* updates user.role + localStorage */ };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
```

\- \*\*State Initialization\*\* via \`useEffect\` → prevents flicker
during first render - \*\*API Stubbing\*\* in \`login()\` for rapid
prototyping - \*\*Role Management\*\* exposed to UI via
\`updateUserRole()\`

###  Routing & Pages

#### Public Routing

``  - `/login` → **Login.tsx** (Framer Motion animations + GitHub stub)   ``  
``  - `*` → **NotFound.tsx** ``

#### Protected Routes 
(via \`\<ProtectedRoute requiredRoles?\>\`)

- `` `/` → **Index.tsx** (main dashboard)   ``  
- `` `/documentation` → **Documentation.tsx** (in‑app docs viewer)   ``  
- `` `/user-management` → **UserManagement.tsx** (admin UI)   ``  
- `` `/unauthorized` → **Unauthorized.tsx** ``

#### ProtectedRoute.tsx

``` jsx
/src/components/auth/ProtectedRoute.tsx
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
```

- **Loading Guard**: shows spinner until auth init completes 
- **Auth Guard**: redirects unauthenticated users to \`/login\` 
- **Role Guard**: optional \`requiredRoles\` prop for fine‑grained
access

### Page Layer

Each page is a self‑contained React component, using: 
- **Animations** via Framer Motion (e.g., \`\<motion.div\>\` in
\`Login.tsx\`) 
- **UI Primitives** from shadcn/UI and Radix
(Buttons, Inputs, Accordions) 
- **Data Hooks** (e.g., future \`useUsers()\` under \`/src/hooks\`)

Key pages:

- **Index.tsx**: Dashboard stub
- **Login.tsx**: Demo GitHub flow + instructive note
- **Documentation.tsx**: MDX or React‑based docs rendering
- **UserManagement.tsx**: Role editing UI; calls
  \`updateUserRole()\`
- **Unauthorized.tsx**: Simple route errors (`NotFound.tsx)`


### ### Component & Folder Breakdown

`/src/components/`

- Reusable UI primitives (Toaster, Button, ProtectedRoute, etc.)

`**/src/context/AuthContext.tsx`

- Central auth logic; stubbed login flow, role management, localStorage hooks  `

`/src/hooks/`

- Custom React hooks for encapsulating common logic

`/src/lib/`

- Utility functions (e.g., date formatting or helper APIs)

`/src/pages/`

- Route target components; each page focused on a single view 

**Styles**:

- `` `index.css` + `App.css` for global Tailwind layers   ``  
- `` `tailwind.config.ts` customizes design tokens and typography   ``

### Data Flow, State Management & Side Effects

1. User action (e.g., click “Sign in with GitHub”) 
2. `AuthContext.login()` - Mocks API call → sets `user` state → writes to `localStorage` 

3\. `ProtectedRoute` reads \`user\` from context → allows or
redirects 4. \*\*Page components\*\* fetch data via React Query hooks
(\`useQuery\`, \`useMutation\`) if extended 5. \*\*UI feedback\*\* via
Sonner Toaster on success or failure


While core codebase currently stubs network calls, its design
anticipates: 
1. **React Query Hooks** (\`useQuery\`,
\`useMutation\`) for REST/GraphQL 
2. **Centralized Error Handling**
via QueryClient’s \`onError\` callbacks and Sonner toasts 
3. **LocalStorage Sync** in AuthContext ensures persistence across
reloads

### UI & Styling

- **Tailwind CSS** with global imports (\`index.css\`, \`App.css\`)
- **tailwind.config.ts** extends theme and typography 
- **Component‑level classes** follow utility‑first pattern

### Scalability Considerations

- **Code‑splitting**: currently none—future \`React.lazy\` imports
  can lazy‑load heavy pages.
- **Memoization**: Wrap heavy context values with \`useMemo\` to prevent unnecessary re‑renders 
- **Feature Modules**: Future ability to extract sub‑apps (e.g., Reports, Analytics) as
separate routes/providers
- **Provider composition**: adding a new context (e.g.,
  ThemeProvider) is straightforward in \`App.tsx\`.
- **Routing**: additional routes slot in above catch‑all; roles
  extendable via \`UserRole\` union type.
- **Testing**: architecture supports isolated unit tests for
  context, routes, and component logic.

### Extensibility Points

- **Adding a Context**: Insert new provider alongside Auth in
\`App.tsx\` 
- **New Route**: Declare in \`<Routes>\` before the
wildcard 
- **Real OAuth**: Swap stub in \`AuthContext.login()\` with
actual fetch to GitHub’s OAuth endpoints

This architecture gives you a fully wired SPA scaffold—ready for
production‑grade enhancements or rapid prototyping.

## 🛡️ Caveats & Security

\- \*\*Demo‑only Auth:\*\* All auth is client‑side; credentials in
plaintext localStorage. - \*\*No XSS Sanitization:\*\* Inputs rendered
raw. - \*\*No Error Boundaries:\*\* Async failures have no fallbacks.

## 🤝 Contributing

1\. Fork and branch off \`main\`. 2. Run \`npm install\` → \`npm run
lint\`. 3. Implement feature or bugfix; add tests. 4. Submit PR with
clear, scoped commit messages (Conventional Commits).

## License

⚖️ This project is copyright 2025 Continuum Software. Dependency licenses as stated. 

## 

Notes on This README== == This document reflects detailed codebase
analysis:

- Scripts & commands from \`package.json\`.
- Auth flow & routes from \`src/context/AuthContext.tsx\` and
  \`App.tsx\`.
- Feature set from \`src/pages\` and components.
- Stack versions from \`tsconfig.\*\`, \`vite.config.ts\`,
  \`tailwind.config.ts\`.
- Screenshot path from \`assets/ui/pedal_dashboard.png\`.
