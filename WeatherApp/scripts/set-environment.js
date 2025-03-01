const fs = require('fs');

// Get API key from Vercel environment variables
const apiKey = process.env.NG_APP_API_KEY || '';

// Define environment file content
const envContent = `export const env = { production: false, API_KEY: '${apiKey}' };`;
const prodEnvContent = `export const env = { production: true, API_KEY: '${apiKey}' };`;

// Ensure environments directory exists
const envDir = 'src/environments';
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir);
}

// Write the environment files
fs.writeFileSync(`${envDir}/environment.ts`, envContent);
fs.writeFileSync(`${envDir}/environment.prod.ts`, prodEnvContent);
