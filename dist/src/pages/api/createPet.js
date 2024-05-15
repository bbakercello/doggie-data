var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/pages/api/createPet.ts (renaming for clarity)
import { PrismaClient } from '@prisma/client';
import GenerateQRCode from './generateQRCode'; // Ensure correct path to the utility
const prisma = new PrismaClient();
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === 'POST') {
            const { name, description, photo, ownerId } = req.body;
            try {
                // Create a new pet in the database
                const newPet = yield prisma.pet.create({
                    data: {
                        name,
                        description,
                        photo,
                        ownerId
                    }
                });
                // Generate a QR code for the new pet
                const qrCodeUrl = yield GenerateQRCode(newPet.id);
                // Update the pet with the QR code URL
                const updatedPet = yield prisma.pet.update({
                    where: { id: newPet.id },
                    data: { qrCode: qrCodeUrl }
                });
                res.status(201).json(updatedPet);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create pet', message: error.message });
            }
        }
        else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
