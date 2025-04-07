# Technical Implementation - Phase 2

This document explains the technical implementation details for Phase 2 of the DevOps and Containerization course materials. It includes Dockerized development environment, GitHub Actions deployment workflow, and repository setup instructions.

## 1. Dockerized Development Environment

### Development Dockerfile (Dockerfile.dev)

The `Dockerfile.dev` is configured to provide a development environment with hot reload capabilities. It:

- Uses Node.js 18 Alpine as a lightweight base image
- Sets up the working directory in the container
- Copies and installs dependencies using pnpm
- Mounts the source code directory at runtime (via docker-compose)
- Exposes port 5173 for the Vite dev server
- Configures the dev server to be accessible outside the container

```dockerfile
# Development Dockerfile with hot reload for Vite React application
FROM node:18-alpine

WORKDIR /app

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install

# Copy project files
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start development server with hot reload
CMD ["pnpm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Docker Compose Configuration (docker-compose.yml)

The docker-compose file simplifies the development process by:

- Building the container from the Dockerfile.dev
- Mapping the host port to the container port
- Mounting the local directory as a volume for hot reload
- Setting appropriate environment variables for development

```yaml
version: '3.8'

services:
  nft_app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: nft_dev_app
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## 2. GitHub Actions Workflow for Deployment

The GitHub Actions workflow automates the deployment process to GitHub Pages:

```yaml
# This is the name of our workflow that appears in the GitHub Actions tab
name: Deploy to GitHub Pages

# This section defines when the workflow will run
on:
  # The workflow will run automatically when code is pushed to the main branch
  push:
    branches: [main]
  # This allows you to manually trigger the workflow from the Actions tab in GitHub
  # Useful for re-running deployments without changing code
  workflow_dispatch:

# Permissions section - CRITICAL for GitHub Pages deployment
# These permissions are required for the GitHub Pages deployment to work correctly
permissions:
  # Read access to the repository contents
  contents: read
  # Write access to GitHub Pages - needed to publish the site
  pages: write
  # Write access to the OIDC token - required for deployment authentication
  id-token: write

# Concurrency settings prevent multiple deployments from running at the same time
# This avoids conflicts and ensures only one deployment happens at a time
concurrency:
  # The group name ensures all jobs related to the same branch/PR will be grouped
  group: "pages"
  # This setting cancels any in-progress job in the group when a new one is started
  # Saves GitHub Actions minutes and ensures only the latest code is deployed
  cancel-in-progress: true

# Jobs section defines the actual work that will be performed
jobs:
  # The build job compiles our application into static files
  build:
    # Using a specific Ubuntu version (22.04) instead of latest
    # This ensures consistent behavior over time as 'latest' changes
    runs-on: ubuntu-22.04
    # Steps are individual tasks that run sequentially
    steps:
      # Step 1: Check out the repository code so the workflow can access it
      # This is almost always the first step in any workflow
      - name: Checkout repository
        # This uses a pre-built action from the GitHub Marketplace
        # v4 is the version - generally use the latest stable version
        uses: actions/checkout@v4

      # Step 2: Install pnpm package manager
      # This MUST come before setup-node when using pnpm for caching
      - name: Install pnpm
        # This action sets up pnpm on the runner
        uses: pnpm/action-setup@v2
        with:
          # Specify which version of pnpm to use
          version: 8
          # Don't install dependencies yet - we'll do that later
          # Setting to false because we want to cache them in the next step
          run_install: false

      # Step 3: Setup Node.js environment
      - name: Setup Node.js
        # Official action to set up Node.js
        uses: actions/setup-node@v4
        with:
          # The version of Node.js to use
          # You can specify an exact version (e.g., "18.15.0") or a major version with latest minor/patch
          node-version: "18"
          # Enables caching of dependencies to speed up workflows
          # We specify "pnpm" since that's our package manager
          cache: "pnpm"

      # Step 4: Install project dependencies using pnpm
      - name: Install dependencies
        # This is a direct command run in the shell, not an action
        # It installs all dependencies defined in your package.json
        run: pnpm install

      # Step 5: Build the application for production
      - name: Build application
        # This runs the build script defined in package.json
        # For a Vite app, this typically runs "vite build"
        run: pnpm build

      # Step 6: Upload the built files as an artifact for the deployment job
      - name: Upload build artifact
        # This action handles artifact creation for GitHub Pages
        uses: actions/upload-pages-artifact@v3
        with:
          # The path to the directory containing the built files
          # For Vite, this is typically "./dist"
          path: ./dist

  # The deploy job publishes the built site to GitHub Pages
  # This job runs after the build job and depends on its artifacts
  deploy:
    # Define the environment for this job
    # This connects to the GitHub Pages settings for your repo
    environment:
      # The name of the environment
      name: github-pages
      # This variable will be set to the URL of your deployed site
      url: ${{ steps.deployment.outputs.page_url }}
    # This job depends on the build job
    # The deploy job won't start until the build job completes successfully
    needs: build
    # Using a specific Ubuntu version (22.04) instead of latest
    # This ensures consistent behavior over time as 'latest' changes
    runs-on: ubuntu-22.04
    # Steps for the deploy job
    steps:
      # Step 1: Deploy the site to GitHub Pages
      # This is the only step needed as the artifact is already prepared
      - name: Deploy to GitHub Pages
        # This ID is used to reference this step (used in the url environment variable above)
        id: deployment
        # This action handles the actual deployment to GitHub Pages
        uses: actions/deploy-pages@v4
        # No additional configuration is needed here
        # The action automatically uses the artifact from the build job
```

### Key Workflow Features:

1. **Triggering Events**: 
   - Automatic deployment on push to main branch
   - Manual trigger option via GitHub interface

2. **Permissions Setup**:
   - Appropriate permissions for GitHub Pages deployment

3. **Concurrency Control**:
   - Prevents multiple deployments running simultaneously
   - Cancels in-progress deployments if new ones are triggered

4. **Build Process**:
   - Checks out the code repository
   - Sets up Node.js environment
   - Uses pnpm for dependency management
   - Builds the application
   - Uploads build artifacts

5. **Deployment Process**:
   - Deploys to GitHub Pages environment
   - Provides deployment URL for verification

## 3. GitHub Pages Configuration

### Vite Configuration for GitHub Pages (vite.config.js)

The Vite configuration has been modified to support GitHub Pages deployment by adding a base path:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Change 'nft_dev' to your actual repository name when deploying
  base: '/nft_dev/',
})
```

### Package.json Configuration

The package.json file includes:

1. The homepage field for GitHub Pages URL
2. Additional deployment scripts for GitHub Pages

```json
{
  "name": "nft_dev",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://USERNAME.github.io/nft_dev",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  ...
}
```

## 4. Status Badge Implementation

The README.md includes a GitHub Actions workflow status badge:

```markdown
[![Deploy to GitHub Pages](https://github.com/USERNAME/nft_dev/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/nft_dev/actions/workflows/deploy.yml)
```

This badge:
- Displays the current status of the deployment workflow
- Links directly to the GitHub Actions workflow details
- Provides immediate visibility of the CI/CD pipeline status

## 5. NFT Marketplace Implementation

The application is styled according to the reference design with:

- Clean, modern UI with a light blue background
- Responsive layout for different screen sizes
- Navigation with Marketplace, Activity, Community links
- Hero section with heading and call-to-action buttons
- NFT artwork display

The CSS uses:
- CSS variables for consistent theming
- Flexbox for layout management
- Media queries for responsiveness
- Modern typography with the Inter font family

## Common Troubleshooting Tips

1. **Docker Hot Reload Issues**:
   - Verify the volume mounts are correctly configured
   - Check that the Vite host is set to 0.0.0.0 to allow external connections

2. **GitHub Pages Deployment Problems**:
   - Confirm the base path in vite.config.js matches your repository name
   - Ensure the homepage field in package.json has your GitHub username
   - Verify that appropriate permissions are set in the GitHub Actions workflow
   - Check that GitHub Pages is enabled in repository settings

3. **Build Errors**:
   - Review the GitHub Actions logs for specific build failure details
   - Test with a local build to identify and fix issues before pushing
   - Check for missing dependencies or incorrect import paths

## Next Steps for Students

After completing the implementation, students should:

1. Update all USERNAME placeholders with their actual GitHub username
2. Push the code to their GitHub repository
3. Verify the GitHub Actions workflow executes correctly
4. Check that the deployment to GitHub Pages works as expected
5. Confirm the status badge displays correctly in the README 