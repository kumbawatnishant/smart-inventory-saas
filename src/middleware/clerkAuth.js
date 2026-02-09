const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// This middleware will ensure that the request is authenticated
// It attaches the user object to the request if valid
const clerkAuth = ClerkExpressRequireAuth({
  // Add your Clerk Secret Key in .env as CLERK_SECRET_KEY
});

module.exports = clerkAuth;