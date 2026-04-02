# DebtPadi — Credit Tracker for Nigerian Small Businesses

A full-featured Next.js frontend prototype for tracking credit sales and outstanding debts.

## Pages Included

| Route | Description |
|-------|-------------|
| `/` | Landing page with features, pricing, testimonials |
| `/auth/signin` | Sign in page |
| `/auth/signup` | 2-step sign up flow |
| `/dashboard` | Main dashboard with stats, overdue debts, activity |
| `/debtors` | Full debt register with filter, search, add modal |
| `/customers` | Customer card grid with WhatsApp reminders |
| `/payments` | Payment history, record payments |
| `/reports` | Charts, analytics, PDF export (pro feature) |
| `/dashboard/settings` | Profile, notifications, billing, security |

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Design System

- **Font**: Clash Display (headings) + Satoshi (body)
- **Colors**: 
  - Ink (dark grays) — primary UI
  - Jade (#00C896) — success / brand accent
  - Coral (#FF5A5A) — danger / overdue
  - Amber (#F5A623) — warning / partial
- **Theme**: Dark landing + light app UI

## Notes

- All data is currently mocked in `lib/data.ts`
- WhatsApp reminders use the `wa.me` deep link
- Backend integration points are clearly separated in the data layer
- The app is fully responsive for mobile

## Backend Integration Points

When you add your backend, replace the mock data in `lib/data.ts` with API calls. Key endpoints you'll need:
- `GET /customers` — list customers
- `POST /customers` — create customer
- `GET /debts` — list all debt records
- `POST /debts` — create debt record
- `POST /debts/:id/payments` — record a payment
- `GET /reports/summary` — dashboard stats
