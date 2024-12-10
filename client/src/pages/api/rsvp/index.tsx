import type { NextApiRequest, NextApiResponse } from 'next';

const Backend = 'http://0.0.0.0:8000';


// API handler function to process RSVP-related requests
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'POST': {
        // Handle RSVP creation (POST request)
        const {event_id, user_id}= req.body;
        const rsvp = {
            event_id: event_id,
            user_id: user_id,
        }

        // Send POST request to the backend API to create an RSVP
        const response = await fetch(`${Backend}/rsvp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rsvp),
        });
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
        }

      
      case 'DELETE': {
        // Handle RSVP deletion (DELETE request)
        const {rsvpId,userId} = req.query;
        const response = await fetch(`${Backend}/rsvp/?rsvp_id=${rsvpId}&user_id=${userId}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
      }

      // Handle unsupported HTTP methods
      default:
        res.setHeader('Allow', ['GET','POST','DELETE']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}