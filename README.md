<figure>
<img src="Pedal_dashboard.png" title="Dashboard Preview" />
<figcaption>Dashboard Preview</figcaption>
</figure>

# PEDAL 1

*Product Engineering Delivery Automation Lifecycle* — a React‑powered
demo dashboard for visualizing and signing off on each stage of your
engineering pipeline.

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

## Installation

### Prerequisites

- Node.js ≥ 16.x
- npm (or bun)

``` bash
# 1. Clone repository
git clone https://github.com/your-org/pedal-1.git
cd pedal-1

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Then open your browser at
[<http://localhost:8080>](http://localhost:8080).

## Usage

### Sign in

Click **Sign in with GitHub** on the login page — no OAuth setup
required. You’ll be randomly assigned a demo user role.

### Explore the app

- **Pipeline**: View artifacts, progress, and approvals.
- **Documentation**: Built‑in docs page for project overview.
- **User Management (admin only)**: Change roles to test UI permissions.

### Build for production

``` bash
npm run build        # output → dist/
npm run preview      # serve production build locally
```

## Tech Stack

| Layer     | Framework / Lib                                |
|-----------|------------------------------------------------|
| Build     | Vite                                           |
| Language  | TypeScript                                     |
| UI        | React 18 + Shadcn/UI (Radix UI + Tailwind CSS) |
| Routing   | React Router DOM                               |
| Animation | Framer Motion                                  |
| Styling   | Tailwind CSS                                   |
| Toasts    | Sonner                                         |
| Mock Auth | React Context + localStorage                   |

## Configuration

No additional environment variables or servers are required. All auth
and data are mocked in:

- `src/context/AuthContext.tsx`
- `src/components/workflow/Pipeline.tsx`

## Contributing

Contributions welcome!

- Fork the repo
- `npm install && npm run dev`
- Commit with clear messages
- Open a PR against `main`

## Testing

No automated tests yet. Consider adding Jest or Playwright in future
iterations.

## License

No LICENSE file detected. If open‑sourcing, consider an MIT License.

## Support

Bugs & feature requests → [GitHub
Issues](https://github.com/your-org/pedal-1/issues)