# Environment Variables Setup

This project uses environment variables to manage sensitive credentials securely.

## Local Development Setup

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your credentials:**
   ```bash
   # PostHog Configuration
   POSTHOG_API_KEY=your_actual_posthog_api_key_here
   
   # Azure DevOps PAT (if needed locally)
   AZURE_PAT=your_azure_pat_here
   ```

3. **The `.env` file is git-ignored** and will never be committed to the repository.

## GitHub Actions Setup

For CI/CD in GitHub Actions, secrets are managed through GitHub's secrets management:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:
   - `POSTHOG_API_KEY`: Your PostHog API key
   - `AZURE_PAT`: Your Azure DevOps Personal Access Token

## How It Works

- **Local Development**: The `dotenv` package loads variables from `.env` file
- **GitHub Actions**: Environment variables are injected from GitHub Secrets
- **Code**: `PosthogHelper` reads from `process.env.POSTHOG_API_KEY`

## Security Notes

- ✅ Never commit `.env` file to git
- ✅ Use `.env.example` to document required variables
- ✅ Store production secrets in GitHub Secrets
- ✅ Rotate API keys if accidentally exposed
