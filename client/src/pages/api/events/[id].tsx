import type { NextApiRequest, NextApiResponse } from 'next';

// Backend API base URL
const Backend = 'http://0.0.0.0:8000';

// API route handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extract the `id` parameter from the query string
  const { id } = req.query;

  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        // Fetch event details by ID
        const response = await fetch(`${Backend}/events/event/id/${id}`);
        const data = await response.json();

        if (!response.ok) {
          // If the backend response is not OK, forward the error response
          return res.status(response.status).json(data);
        }

        // Return the event details
        return res.status(200).json(data);
      }

      case 'DELETE': {
        // Delete the event with the specified ID
        const response = await fetch(`${Backend}/events/event/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (!response.ok) {
          // If the backend response is not OK, forward the error response
          return res.status(response.status).json(data);
        }

        // Return a success response after deletion
        return res.status(200).json(data);
      }

      case 'PUT': {
        // Extract the event data from the request body
        const {
          name,
          food_type,
          description,
          location,
          rsvp_count,
          servings,
          expiration,
          created_at,
          host_id,
          create_by,
        } = req.body;

        // Update the event with the specified ID
        const response = await fetch(`${Backend}/events/event/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            food_type,
            description,
            location,
            rsvp_count,
            servings,
            expiration,
            created_at,
            host_id,
            create_by,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // If the backend response is not OK, forward the error response
          return res.status(response.status).json(data);
        }

        // Return the updated event data
        return res.status(200).json(data);
      }

      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']); // Specify allowed methods
        return res.status(405).json({
          message: `Method ${req.method} not allowed`,
        }); // Return 405 status code
    }
  } catch (error: any) {
    // Catch and handle unexpected errors
    res.status(500).json({
      message: `Internal server error: ${error.message}`,
    });
  }
}
