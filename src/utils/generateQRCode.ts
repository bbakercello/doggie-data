import QRCode from 'qrcode';
import config from '../config';  // Adjust path if necessary

async function GenerateQRCode(petId: number): Promise<string> {
  const url = `${config.endpoints.discoverPet}/${petId}`;  // Use the config to form the URL
  try {
    const qrCodeImage = await QRCode.toDataURL(url);
    return qrCodeImage;
  } catch (error) {
    console.error("Failed to generate QR code", error);
    throw new Error("Failed to generate QR code");
  }
}

export default GenerateQRCode;