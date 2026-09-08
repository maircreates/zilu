# Deployment

The web app (`apps/web`) is built as a Cloudflare Worker (server-rendered) with
static assets. `.github/workflows/deploy.yml` deploys it to Cloudflare Workers on
every push to `main`.

Until the two repository secrets below exist, the workflow runs but skips the
deploy with a warning (no failed check).

## One-time setup

### 1. Create a free Cloudflare account

- Go to <https://dash.cloudflare.com/sign-up>.
- Enter an email and password, submit, then click the verification link in the
  email Cloudflare sends.
- No credit card is required. The Workers free plan covers 100,000 requests/day
  and unlimited static asset requests.

### 2. Copy your Account ID

- In the dashboard, open **Compute (Workers)** (older UI: **Workers & Pages**).
- The **Account ID** is shown in the right-hand sidebar (or under the account
  name). Copy it.

### 3. Create an API token

- Open <https://dash.cloudflare.com/profile/api-tokens>.
- **Create Token** -> use the **Edit Cloudflare Workers** template -> **Continue
  to summary** -> **Create Token**.
- Copy the token now; it is shown only once.

### 4. Add both as GitHub repository secrets

- Go to the repo on GitHub -> **Settings** -> **Secrets and variables** ->
  **Actions** -> **New repository secret**. Add:
  - `CLOUDFLARE_API_TOKEN` — the token from step 3
  - `CLOUDFLARE_ACCOUNT_ID` — the ID from step 2

### 5. Trigger the first deploy

- **Actions** tab -> **Deploy to Cloudflare** -> **Run workflow** (or push any
  commit to `main`).
- When it finishes, the Worker URL is in the dashboard under
  **Compute (Workers) -> zilu-web** (a `*.workers.dev` address). A custom domain
  can be attached there later.

## After setup

- Every push to `main` redeploys automatically (~1–2 minutes).
- Manual deploy from a local checkout: `cd apps/web && npx wrangler login` once,
  then `pnpm run deploy`.
- The Worker name (`zilu-web`) and compatibility settings come from
  `apps/web/dist/server/wrangler.json`, which `pnpm build` regenerates from
  `apps/web/vite.config.ts`. There are currently no D1/R2 or other bindings.
