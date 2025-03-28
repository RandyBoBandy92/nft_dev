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
      - CHOKIDAR_USEPOLLING=true
```

## 2. GitHub Actions Workflow for Deployment

The GitHub Actions workflow automates the deployment process to GitHub Pages:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: false

      - name: Install dependencies
        run: pnpm install

      - name: Build application
        run: pnpm build
        
      - name: Upload build artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
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
   - Ensure the CHOKIDAR_USEPOLLING environment variable is set to true
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