import type { NextApiRequest, NextApiResponse } from 'next';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const ServerUrl = 'http://0.0.0.0:8000/products';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {

        const page = req.query.page || '1';
        const limit = req.query.limit || '10';

        const url = `${ServerUrl}?page=${page}&limit=${limit}`;
        
        const fastApiResponse = await fetch(url);
        
        if (!fastApiResponse.ok) {
          throw new Error(`Error fetching data: ${fastApiResponse.statusText}`);
        }

        const data: Product[] = await fastApiResponse.json();
        res.status(200).json(data);
        break;
      }

      case 'POST': {
        const fastApiResponse = await fetch(ServerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });
        
        if (!fastApiResponse.ok) {
          throw new Error(`Error posting data: ${fastApiResponse.statusText}`);
        }

        const data = await fastApiResponse.json();
        res.status(201).json(data);
        break;
      }
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error:any) {
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
}
