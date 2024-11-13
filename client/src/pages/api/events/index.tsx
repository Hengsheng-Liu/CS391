import type { NextApiRequest, NextApiResponse } from 'next';

interface Event {
    name: string;
    food_type: string;
    description: string;
    location: string;
    rsvp_count: number;
    servings: number;
    expiration: string;
    created_at: string;
    host_id: number;
    create_by: number;
}

const Backend = 'http://0.0.0.0:8000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        const response = await fetch(`${Backend}/events/events`);
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
      }
      case 'POST': {
        const {  name, food_type, description,location,rsvp_count,servings,expiration,created_at,host_id,create_by } = req.body;
        const response = await fetch(`${Backend}/events/event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, food_type, description,location,rsvp_count,servings,expiration,created_at,host_id,create_by }),
        });
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}