# NFT Marketplace Demo

[![Deploy to GitHub Pages](https://github.com/USERNAME/nft_dev/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/nft_dev/actions/workflows/deploy.yml)

A simple NFT marketplace landing page built with React and Vite.

![NFT Marketplace Preview](landing_page.png)

## Development with Docker

This project includes a development environment with hot reload capabilities using Docker.

### Prerequisites

- Docker and Docker Compose installed on your machine
- Git

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/USERNAME/nft_dev.git
   cd nft_dev
   ```

2. Start the development container:
   ```bash
   docker-compose up
   ```

3. Access the application at `http://localhost:5173`

## GitHub Pages Deployment Setup

### Setting up your GitHub Repository

1. Create a new GitHub repository
   - Go to [GitHub](https://github.com) and create a new repository named `nft_dev`
   - Make the repository public for GitHub Pages

2. Update your local repository
   ```bash
   git remote set-url origin https://github.com/USERNAME/nft_dev.git
   ```

3. Update the placeholders
   - In `package.json`: Change `USERNAME` in the homepage URL to your GitHub username
   - In `vite.config.js`: Ensure the base path matches your repository name

4. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

### Enabling GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment", select "GitHub Actions" as the source

### Adding Status Badge to README

1. Replace the `USERNAME` in the badge URL with your GitHub username:
   ```markdown
   [![Deploy to GitHub Pages](https://github.com/USERNAME/nft_dev/actions/workflows/deploy.yml/badge.svg)](https://github.com/USERNAME/nft_dev/actions/workflows/deploy.yml)
   ```

## Manual Deployment

You can also manually deploy the application:

```bash
pnpm install
pnpm run deploy
```

## Troubleshooting

- **Build Failures**: Ensure all dependencies are installed correctly
- **Deployment Issues**: Check GitHub Actions logs for detailed error information
- **Path Problems**: Verify that the base path in `vite.config.js` matches your repository name

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
