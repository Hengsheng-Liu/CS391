import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';

const Backend = 'http://0.0.0.0:8000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {id} = req.query;
  try {
    switch (req.method) {
      case 'GET': {
        const response = await fetch(`${Backend}/events/event/id/${id}`);
        const data = await response.json();
        if(!response.ok){
            return res.status(response.status).json(data);
        }
        return res.status(200).json(data);
        }
      case 'DELETE': {
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
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}