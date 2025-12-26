// Quick script to check if environment variables are loaded
require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables Check:');
console.log('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? '✓ Set' : '✗ Missing');
console.log('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? '✓ Set' : '✗ Missing');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set (will use default)');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Not set (will use default)');
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✓ Set' : 'Not set (will use default)');



