const fs = require('fs');
const path = require('path');

// Get environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CORS_ORIGINS = process.env.NEXT_PUBLIC_CORS_ORIGINS || 'http://localhost:3000,http://localhost:8000';

// Generate the config file content
const configContent = `// Service Worker Configuration
// This file is generated during build with environment variables
// Generated at: ${new Date().toISOString()}

self.SW_CONFIG = {
  API_URL: '${API_URL}',
  APP_URL: '${APP_URL}',
  CORS_ORIGINS: '${CORS_ORIGINS}'.split(',')
};
`;

// Write to public directory
const outputPath = path.join(__dirname, '..', 'public', 'sw-config.js');
fs.writeFileSync(outputPath, configContent);

console.log('Generated sw-config.js with:');
console.log(`  API_URL: ${API_URL}`);
console.log(`  APP_URL: ${APP_URL}`);