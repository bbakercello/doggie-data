var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/pages/api/discoverPet.ts
import { PrismaClient } from '@prisma/client';
import GenerateQRCode from '@/pages/api/generateQRCode'; // Adjust the path as necessary
const prisma = new PrismaClient();
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method === 'POST') {
            const { userId, petId } = req.body;
            try {
                // Update user to connect the discovered pet
                const result = yield prisma.user.update({
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
                const qrCodeUrl = yield GenerateQRCode(petId);
                // Return the result and the QR code URL
                res.status(200).json({ result, qrCodeUrl });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to discover pet', message: error.message });
            }
        }
        else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
