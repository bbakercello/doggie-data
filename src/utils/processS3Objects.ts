import 'dotenv/config';
import { S3 } from 'aws-sdk';
import { PrismaClient } from '@prisma/client';
import { generateQRCode } from './generateQRCode'; // Adjust the path as necessary

const s3 = new S3({
  region: process.env.AWS_REGION
});

const prisma = new PrismaClient();

async function processS3Objects(): Promise<void> {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string
    };

    const data = await s3.listObjectsV2(params).promise();
    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key || '';
      const name = key.split('-')[0];
      const description = key;
      const photo = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // Check if the pet already exists using composite unique constraint
      const existingPet = await prisma.pet.findFirst({
        where: {
          name,
          description,
          photo
        }
      });

      if (!existingPet) {
        // Create a new pet in the database
        const newPet = await prisma.pet.create({
          data: {
            name,
            description,
            photo
          }
        });

        // Generate a QR code for the new pet
        const qrCodeUrl = await generateQRCode(newPet.id);

        // Update the pet with the QR code URL
        await prisma.pet.update({
          where: { id: newPet.id },
          data: { qrCode: qrCodeUrl }
        });

        console.log(`Added new pet: ${name}`);
      } else {
        console.log(`Pet already exists: ${name}`);
      }
    }
  } catch (error) {
    console.error('Error processing S3 objects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

processS3Objects();
