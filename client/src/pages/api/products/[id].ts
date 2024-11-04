import type { NextApiRequest, NextApiResponse } from 'next';
import { useRouter } from 'next/router';

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
                const {id} = req.query;
                const url = `${ServerUrl}/${id}`;
                console.log(id);
                const fastApiResponse = await fetch(url);
                if (!fastApiResponse.ok) {
                    throw new Error(`Error fetching data: ${fastApiResponse.statusText}`);
                }
                const data: Product = await fastApiResponse.json();
                res.status(200).json(data);
                break;
            }
            default:
                res.setHeader('Allow', ['GET', ]);
                res.status(405).json({ message: `Method ${req.method} not allowed` });
        }
    } catch (error:any) {
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}