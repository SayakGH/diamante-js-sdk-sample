import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';
import {
    Keypair,
    TransactionBuilder,
    Operation,
    Networks
} from 'diamante-base';
import { Horizon } from 'diamante-sdk-js';

// Register controller
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      user = new User({
        username,
        email,
        password,
        publicKey: '',
        secret: ''
      });
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // Generate keypair
      const keypair = Keypair.random();
      user.publicKey = keypair.publicKey();
      user.secret = keypair.secret();
  
      const fetch = await import('node-fetch').then(mod => mod.default);
        const response = await fetch(`https://friendbot.diamcircle.io/?addr=${user.publicKey}`);
        if (!response.ok) {
            throw new Error(`Failed to activate account ${user.publicKey}: ${response.statusText}`);
        }

      // Save user to the database
      await user.save();
  
      // Generate token
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ token, publicKey: user.publicKey, secret: user.secret });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
