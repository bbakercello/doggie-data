var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import QRCode from 'qrcode';
import { config } from '../config'; // Adjust path if necessary
export function generateQRCode(petId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${config.endpoints.discoverPet}/${petId}`; // Use the config to form the URL
        try {
            const qrCodeImage = yield QRCode.toDataURL(url);
            return qrCodeImage;
        }
        catch (error) {
            console.error("Failed to generate QR code", error);
            throw new Error("Failed to generate QR code");
        }
    });
}
