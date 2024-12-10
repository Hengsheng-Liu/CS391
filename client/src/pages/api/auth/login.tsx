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
    const { email, password, name, signUp } = req.body;

    if (signUp === false) {
      // Handle login process
      const response = await fetch(
        `${Backend}/users/user?email=${email}&password=${password}`
      );
      const data = await response.json();

      if (!response.ok) {
        // Return the backend error response if login fails
        return res.status(response.status).json(data);
      }

      // Return successful login response
      return res.status(200).json(data);

    } else if (signUp === true) {
      // Handle user sign-up process
      const response = await fetch(`${Backend}/users/user`, {
        method: 'POST', // Use POST to create a new user
        headers: {
          'Content-Type': 'application/json', // Specify JSON content
        },
        body: JSON.stringify({ email, password, name }), // Send user data
      });

      const data = await response.json();

      if (!response.ok) {
        // Return the backend error response if sign-up fails
        return res.status(response.status).json(data);
      }

      // Return successful sign-up response
      return res.status(200).json(data);

    } else {
      // Handle invalid 'signUp' value
      return res.status(400).json({ message: "Invalid 'signUp' value" });
    }

  } catch (error: any) {
    // Handle unexpected errors and return a 500 Internal Server Error
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
