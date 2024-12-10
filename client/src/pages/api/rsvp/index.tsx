import type { NextApiRequest, NextApiResponse } from 'next';

// Backend API base URL
const Backend = 'http://0.0.0.0:8000';

// API route handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Switch based on the HTTP method of the request
    switch (req.method) {
      case 'POST': {
        // Extract event_id and user_id from the request body
        const { event_id, user_id } = req.body;

        // Construct RSVP payload to send to the backend
        const rsvp = {
          event_id: event_id,
          user_id: user_id,
        };

        // Make a POST request to the backend API to create an RSVP
        const response = await fetch(`${Backend}/rsvp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rsvp), // Send RSVP data as JSON
        });

        const data = await response.json(); // Parse the response JSON

        // Check if the response is not OK
        if (!response.ok) {
          return res.status(response.status).json(data); // Forward the error response
        }

        // Return the successful response
        return res.status(200).json(data);
      }

      case 'DELETE': {
        // Extract rsvpId and userId from the query parameters
        const { rsvpId, userId } = req.query;

        // Make a DELETE request to the backend API to remove an RSVP
        const response = await fetch(`${Backend}/rsvp/?rsvp_id=${rsvpId}&user_id=${userId}`, {
          method: 'DELETE',
        });

        const data = await response.json(); // Parse the response JSON

        // Check if the response is not OK
        if (!response.ok) {
          return res.status(response.status).json(data); // Forward the error response
        }

        // Return the successful response
        return res.status(200).json(data);
      }

      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']); // Allowable methods
        res.status(405).json({ message: `Method ${req.method} not allowed` }); // Method not allowed
    }
  } catch (error: any) {
    // Handle any unexpected errors
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}
