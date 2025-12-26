# Bina Marga Number Generator

A web application for automatically generating BAST and Contract numbers for Bina Marga, replacing manual registration books.

## Features

- **BAST Number Generator**: Generate BAST numbers in the format `{SEQUENCE}/BAST-BM/{ROMAN_MONTH}/{YEAR}`
- **Contract Number Generator**: Generate contract numbers with location, work type, and procurement type
- **Authentication**: Secure authentication using NextAuth.js
- **History Tracking**: View all generated numbers with filtering capabilities
- **Separate Counters**: BAST and Contract modules maintain completely independent counter logic

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: Turso (SQLite-compatible)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Turso database account and credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd application
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_password_here
```

**⚠️ Security Note**: Use strong, unique passwords for `ADMIN_PASSWORD`. Never commit actual credentials to version control.

4. Initialize the database:
The database schema will be automatically initialized on first run. Make sure your Turso database is accessible.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Import your project to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add the following variables:
     - `TURSO_DATABASE_URL` - Your Turso database URL
     - `TURSO_AUTH_TOKEN` - Your Turso authentication token
     - `NEXTAUTH_SECRET` - Generate a random secret (use `openssl rand -base64 32`)
     - `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
     - `ADMIN_EMAIL` - Your admin email address
     - `ADMIN_PASSWORD` - Your secure admin password

4. Deploy:
   - Vercel will automatically detect Next.js and deploy
   - The database schema will be initialized on first deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Your Turso database URL | Yes |
| `TURSO_AUTH_TOKEN` | Your Turso authentication token | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js session encryption (generate with `openssl rand -base64 32`) | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `ADMIN_EMAIL` | Admin email for login | Yes |
| `ADMIN_PASSWORD` | Admin password for login (use a strong, unique password) | Yes |

**⚠️ Important**: Always use strong, unique passwords. Never use default credentials in production.

## Database Schema

The application uses the following tables:

- `bast_counters`: Year-based counters for BAST numbering
- `contract_counters`: Category/year-based counters for contract numbering
- `bast_records`: Stores all generated BAST numbers
- `contract_records`: Stores all generated contract numbers

## Important Notes

- **Separate Counters**: BAST and Contract modules use completely independent counter logic
- **Year-based Reset**: Counters automatically reset when the year changes
- **No Date-based Sequencing**: Sequence numbers are assigned based on generation order, not document date
- **Immutable Numbers**: Once generated, numbers cannot be edited
- **Atomic Operations**: Counter increments use database transactions to prevent race conditions

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## License

Private - Bina Marga Internal Use



