import type { NextApiRequest, NextApiResponse } from 'next';

// Backend API base URL
const Backend = "http://localhost:8000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']); // Specify allowed methods
    return res.status(405).json({ message: `Method ${req.method} not allowed` }); // Return 405 for unsupported methods
  }

  try {
    // Extract required fields from the request body
    const { email } = req.body;

    if (!email) {
      console.error('Email is required');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Make a POST request to the backend API to subscribe the user
    const response = await fetch(`${Backend}/subscriber/notification/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), // Send email data
    });

    const data = await response.json();

    if (!response.ok) {
      // Log specific error if email is already subscribed
      if (response.status === 400 && data.detail === 'Email is already subscribed') {
        console.error('Email is already subscribed:', email);
      }
      // Return the backend error response if subscription fails
      return res.status(response.status).json(data);
    }

    // Return successful subscription response
    return res.status(200).json(data);

  } catch (error: any) {
    // Handle unexpected errors and return a 500 Internal Server Error
    console.error('Internal server error:', error.message || 'Internal server error');
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}