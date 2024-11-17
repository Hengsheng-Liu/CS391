import type { NextApiRequest, NextApiResponse } from 'next';
const Backend = "http://localhost:8000";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check that the request method is POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { email, password, name, signUp } = req.body;

    if (signUp === false) {
      // Handle login
      const response = await fetch(`${Backend}/users/user?email=${email}&password=${password}`, {
      });
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);

    } else if (signUp === true) {
      // Handle sign up
      const response = await fetch(`${Backend}/users/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json(data);

    } else {
      return res.status(400).json({ message: "Invalid 'signUp' value" });
    }

  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
