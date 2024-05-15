var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import { S3 } from 'aws-sdk';
import { PrismaClient } from '@prisma/client';
import GenerateQRCode from './generateQRCode';
const s3 = new S3({
    region: process.env.AWS_REGION
});
const prisma = new PrismaClient();
function processS3Objects() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME
            };
            const data = yield s3.listObjectsV2(params).promise();
            const objects = data.Contents || [];
            for (const object of objects) {
                const key = object.Key || '';
                const name = key.split('-')[0];
                const description = key;
                const photo = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
                // Check if the pet already exists using composite unique constraint
                const existingPet = yield prisma.pet.findFirst({
                    where: {
                        name,
                        description,
                        photo
                    }
                });
                if (!existingPet) {
                    // Create a new pet in the database
                    const newPet = yield prisma.pet.create({
                        data: {
                            name,
                            description,
                            photo
                        }
                    });
                    // Generate a QR code for the new pet
                    const qrCodeUrl = yield GenerateQRCode(newPet.id);
                    // Update the pet with the QR code URL
                    yield prisma.pet.update({
                        where: { id: newPet.id },
                        data: { qrCode: qrCodeUrl }
                    });
                    console.log(`Added new pet: ${name}`);
                }
                else {
                    console.log(`Pet already exists: ${name}`);
                }
            }
        }
        catch (error) {
            console.error('Error processing S3 objects:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
processS3Objects();
