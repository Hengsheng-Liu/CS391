import type { NextApiRequest, NextApiResponse } from 'next';

// Define an Event interface to provide type safety for event objects
interface Event {
  name: string;
  description: string;
  location: string;
  rsvp_count: number;
  expiration: string;
  created_at: string;
  host_id: number;
  create_by: number;
  allergies: string[];
  cuisine: string[];
}

// Backend API base URL
const Backend = 'http://0.0.0.0:8000';

// Main API route handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        // Fetch all events from the backend API
        const response = await fetch(`${Backend}/events/events`);
        const data = await response.json();

        if (!response.ok) {
          // If the response is not OK, forward the backend error to the client
          return res.status(response.status).json(data);
        }

        // Return the list of events to the client
        return res.status(200).json(data);
      }

      case 'POST': {
        // Extract event data from the request body
        const {
          name,
          description,
          location,
          rsvp_count,
          expiration,
          created_at,
          host_id,
          create_by,
          allergies,
          cuisine
        } = req.body;

        // Send a POST request to the backend API to create a new event
        const response = await fetch(`${Backend}/events/event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            location,
            rsvp_count,
            expiration,
            created_at,
            host_id,
            create_by,
            allergies,
            cuisine
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // If the response is not OK, forward the backend error to the client
          return res.status(response.status).json(data);
        }

        // Return the created event data to the client
        return res.status(200).json(data);
      }

      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['GET', 'POST']); // Specify allowed methods
        res.status(405).json({
          message: `Method ${req.method} not allowed`,
        }); // Return 405 Method Not Allowed
    }
  } catch (error: any) {
    // Catch unexpected errors and return a 500 Internal Server Error
    res.status(500).json({
      message: `Internal server error: ${error.message}`,
    });
  }
}
