# Burnley FC Landing Page (React Version)

This is a simple landing page, now built with React, that displays the last 5 results, next 5 matches, and the current Premier League table for Burnley FC.

## Features

-   **React Components:** The application is now built with a modern, component-based architecture.
-   **Burnley FC Tab:** Shows the latest match data for Burnley FC.
-   **Settings Tab:** Allows you to enter and save your football-data.org API key and Cloudflare Worker URL.
-   **Local Storage:** Your settings are saved in your browser's local storage for convenience.
-   **PWA Enabled:** The application is a Progressive Web App and can be installed on your device for an app-like experience.
-   **Responsive Design:** The page is designed to work well on both desktop and mobile devices.

## Setup

1.  **Get an API Key:**
    *   Go to [https://www.football-data.org/](https://www.football-data.org/) and register for a free API key.

2.  **Cloudflare Worker Setup:**
    *   This project requires a Cloudflare Worker to act as a proxy. Follow the instructions in the "Cloudflare Worker Setup" section below.

3.  **Install Dependencies:**
    *   Clone the repository and run `npm install` to install the required packages.

4.  **Run the Application:**
    *   Run `npm start` to start the development server.
    *   Open your browser and go to `http://localhost:3000`.

5.  **Add Your Settings:**
    *   Once the page is loaded, go to the "Settings" tab.
    *   Paste your Cloudflare Worker URL and your API key into the input fields and click "Save".

## Cloudflare Worker Setup (Required)

This project requires a Cloudflare Worker to act as a proxy. This is necessary to securely handle the API key and bypass the domain restrictions of the `football-data.org` API's free tier.

1.  **Create a Cloudflare Account:**
    *   If you don't have one, sign up for a free Cloudflare account at [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).

2.  **Create a Worker:**
    *   From the Cloudflare dashboard, go to the "Workers & Pages" section and click "Create application".
    *   Select "Create Worker".
    *   Give your worker a name (e.g., `burnley-api-proxy`) and click "Deploy".

3.  **Configure the Worker:**
    *   Click "Edit code" to open the worker editor.
    *   Delete the boilerplate code in the editor.
    *   Copy the entire content of the `worker.js` file from this repository.
    *   Paste the copied code into the Cloudflare editor.
    *   Click "Deploy" to save and deploy your worker script.

4.  **Get Your Worker URL:**
    *   After deploying, go back to the worker's detail page. The URL for your worker will be displayed at the top (e.g., `https://burnley-api-proxy.your-subdomain.workers.dev`).

5.  **Configure the Frontend:**
    *   Open the application in your browser at `http://localhost:3000`.
    *   Go to the "Settings" tab.
    *   Paste the URL of your deployed Cloudflare Worker into the "Cloudflare Worker URL" input field.
    *   Paste your `football-data.org` API key into the "API Key" input field.
    *   Click "Save Settings". The application is now configured.

### Automated Worker Deployment with GitHub Actions

This repository includes a GitHub Action workflow to automatically deploy your Cloudflare Worker whenever you push changes to the `main` branch. To enable this, you need to add your Cloudflare credentials as secrets to your GitHub repository.

1.  **Get Your Cloudflare Account ID:**
    *   Go to the Cloudflare dashboard.
    *   On the right-hand side, under "Account ID," click to copy your Account ID.

2.  **Create a Cloudflare API Token:**
    *   In the Cloudflare dashboard, go to "My Profile" -> "API Tokens".
    *   Click "Create Token" and use the "Edit Cloudflare Workers" template.
    *   Under "Account Resources," select your account.
    *   Under "Zone Resources," select "All zones".
    *   Continue to summary and create the token. Copy the generated token.

3.  **Add GitHub Secrets:**
    *   In your GitHub repository, go to "Settings" -> "Secrets and variables" -> "Actions".
    *   Click "New repository secret".
    *   Create a secret named `CF_ACCOUNT_ID` and paste your Account ID as the value.
    *   Create another secret named `CF_API_TOKEN` and paste your API token as the value.

4.  **Check Worker Name:**
    *   The GitHub Action assumes your worker is named `burnley-api-proxy`. If you named it something else, you must update the `name` property in the `wrangler.toml` file to match.

Now, every time you merge changes to your `main` branch, the action will automatically update and deploy your Cloudflare Worker.

## Deployment to GitHub Pages

You can easily host this landing page for free using GitHub Pages.

1.  **Update `package.json`:**
    *   Open your `package.json` file and add a `homepage` field: `"homepage": "https://your-username.github.io/your-repository-name/"`

2.  **Deploy:**
    *   Run `npm run build` to create a production build of the app.
    *   You can then deploy the `build` folder to your GitHub Pages site. A common way to do this is with the `gh-pages` package.
