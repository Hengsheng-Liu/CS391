import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';

const Backend = 'http://0.0.0.0:8000';

// API handler function to process event-related requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // Extract the event ID from the query parameters
    const {id} = req.query;
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
         // Handle fetching a specific event (GET request)
        const response = await fetch(`${Backend}/events/event/id/${id}`);
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
        }

      case 'DELETE': {
        // Handle event deletion (DELETE request)
        const response = await fetch(`${Backend}/events/event/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
      }

      default:
        // Handle unsupported HTTP methods
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}