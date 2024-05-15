// src/pages/api/discoverPet.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import  GenerateQRCode  from '@/utils/GenerateQRCode';  // Adjust the path as necessary
import config from '../../config'; 
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, petId } = req.body;
    try {
      // Update user to connect the discovered pet
      const result = await prisma.user.update({
        where: { id: userId },
        data: {
          discoveredPets: {
            connect: { id: petId },
          }
        },
        include: {
          discoveredPets: true
        }
      });

      // Call the generateQRCode function to get the QR code for the discovered pet
      const qrCodeUrl = await GenerateQRCode(petId);

      // Return the result and the QR code URL
      res.status(200).json({ result, qrCodeUrl });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to discover pet', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

