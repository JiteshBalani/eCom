const express = require('express');
const router = express.Router();
const User = require('./models/User');

app.get('/api/user', ClerkExpressRequireAuth(), async (req, res) => {
  const { userId } = req.auth;
  console.log("Authenticated userId from Clerk:", userId);

  const clerkUser = await clerkClient.users.getUser(userId);
  const name = clerkUser.firstName + ' ' + clerkUser.lastName;
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const phoneNumber = clerkUser.phoneNumbers[0]?.phoneNumber;

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    // Here you could also fetch name/email from Clerk API if desired
    user = await User.create({ 
      clerkId: userId,
      name,
      email,
      phoneNumber 
    });
  }

  res.json(user);
});

module.exports = router;
