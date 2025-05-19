const { ClerkExpressRequireAuth, default: clerkClient } = require('@clerk/clerk-sdk-node');
const dotenv = require('dotenv');

// Default to production unless a specific flag is provided
const envFile = process.argv.includes('--dev') ? '.env.development' : '.env.production';
dotenv.config({ path: envFile });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// app.use(cors({
//     origin: process.env.FRONTEND_URL, 
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true // If you're using cookies/sessions
// }));

// const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require("./routes/orderRoutes");

// app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.get('/api/protected', ClerkExpressRequireAuth(), (req, res) => {
  const { userId } = req.auth;
  res.json({ message: `Authenticated request from user ${userId}` });
});

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

let frontendURL = process.env.FRONTEND_URL
console.log(`Frontend server: ${frontendURL}`);

const dbURL = process.env.DB_URL;

mongoose.connect(dbURL).then( () => {
    try{
        console.log("Connection to MongoDB database successful!");
    }catch(err) {
        console.log(err);
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    try{
        console.log('Backend Server is running on port', PORT);
    } catch(err) {
        console.log(err);
    }
});