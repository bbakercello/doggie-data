// src/pages/api/discoverPet.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, petId } = req.body;
    try {
      const result = await prisma.user.update({
        where: { id: userId },
        data: {
          discoveredPets: {
            connect: { id: petId }, // Connects the pet to the user's discoveredPets
          }
        },
        include: {
          discoveredPets: true // Optionally return the list of discovered pets
        }
      });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to discover pet', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
