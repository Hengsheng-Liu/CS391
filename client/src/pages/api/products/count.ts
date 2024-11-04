import type { NextApiRequest, NextApiResponse } from 'next';

type CountResponse = {
  count: number;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountResponse>
) {
  if (req.method === 'GET') {
    try {
      const fastApiResponse = await fetch('http://localhost:8000/products/count');
      
      if (!fastApiResponse.ok) {
        throw new Error(`Error fetching data: ${fastApiResponse.statusText}`);
      }

      const data = await fastApiResponse.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ count: 0, message: `Failed to fetch product count: ${error}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ count: 0, message: `Method ${req.method} not allowed` });
  }
}
