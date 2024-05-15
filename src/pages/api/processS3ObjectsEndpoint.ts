import { NextApiRequest, NextApiResponse } from 'next';
import processS3Objects from '@/utils/processS3Objects';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await processS3Objects();
      res.status(200).json({ message: 'S3 Objects processed successfully' });
    } catch (error) {
      console.error('Error processing S3 objects:', error);
      res.status(500).json({ error: 'Failed to process S3 objects' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
