// FILE: pages/api/notification/subscribe.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: 'p_user',
  host: 'localhost',
  database: 'hw6_postgres',
  password: 'p_password',
  port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']); // Specify allowed methods
    return res.status(405).json({ message: `Method ${req.method} not allowed` }); // Return 405 for unsupported methods
  }

  try {
    const { email } = req.body;

    if (!email) {
      console.error('Email is required');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email is already subscribed
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM subscribers WHERE email = $1', [email]);

      if (result.rows.length > 0) {
        console.error('Email is already subscribed');
        return res.status(400).json({ error: 'Email is already subscribed' });
      }

      // Add the email to the subscribers table
      await client.query('INSERT INTO subscribers (email) VALUES ($1)', [email]);
      console.log('Subscribed successfully');
      return res.status(200).json({ message: 'Subscribed successfully' });
    } catch (queryError) {
      console.error('Database query error:', queryError);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}