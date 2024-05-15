// src/pages/api/createPet.ts (renaming for clarity)
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import {GenerateQRCode}  from '../../utils/generateQRCode';  // Ensure correct path to the utility

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, description, photo, ownerId } = req.body;

    try {
      // Create a new pet in the database
      const newPet = await prisma.pet.create({
        data: {
          name,
          description,
          photo,
          ownerId
        }
      });

      // Generate a QR code for the new pet
      const qrCodeUrl = await GenerateQRCode(newPet.id);

      // Update the pet with the QR code URL
      const updatedPet = await prisma.pet.update({
        where: { id: newPet.id },
        data: { qrCode: qrCodeUrl }
      });

      res.status(201).json(updatedPet);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create pet', message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
