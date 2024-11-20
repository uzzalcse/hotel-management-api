"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const slugify_1 = __importDefault(require("slugify"));
const uuid_1 = require("uuid");
const DATA_DIR = path_1.default.join(__dirname, '../../data/hotels');
const UPLOADS_DIR = path_1.default.join(__dirname, '../../uploads/images');
class HotelController {
    // Create a new hotel
    async createHotel(req, res) {
        try {
            const hotelData = req.body;
            const id = 'hotel-' + (0, uuid_1.v4)();
            const slug = (0, slugify_1.default)(hotelData.title, { lower: true });
            // Define the hotel object with id, slug, and images at the top, and spread the rest of the hotel data afterward
            const hotel = {
                id,
                slug,
                images: [],
                ...hotelData, // Spread the rest of the hotel data
            };
            await promises_1.default.mkdir(DATA_DIR, { recursive: true });
            await promises_1.default.writeFile(path_1.default.join(DATA_DIR, `${id}.json`), JSON.stringify(hotel, null, 2) // Write the hotel data with the correct order
            );
            return res.status(201).json(hotel);
        }
        catch (error) {
            console.error('Error creating hotel:', error);
            return res.status(500).json({ error: 'Failed to create hotel' });
        }
    }
    // Get hotel by ID
    async getHotel(req, res) {
        try {
            const { hotelId } = req.params;
            const hotelPath = path_1.default.join(DATA_DIR, `${hotelId}.json`);
            const hotelData = await promises_1.default.readFile(hotelPath, 'utf-8');
            const hotel = JSON.parse(hotelData);
            return res.status(200).json(hotel);
        }
        catch (error) {
            console.error('Error getting hotel:', error);
            return res.status(404).json({ error: 'Hotel not found' });
        }
    }
    // Update hotel
    async updateHotel(req, res) {
        try {
            const { hotelId } = req.params;
            const hotelPath = path_1.default.join(DATA_DIR, `${hotelId}.json`);
            const updatedData = req.body;
            const existingHotelData = await promises_1.default.readFile(hotelPath, 'utf-8');
            const existingHotel = JSON.parse(existingHotelData);
            // If the title is updated, update the slug as well
            if (updatedData.title) {
                updatedData.slug = (0, slugify_1.default)(updatedData.title, { lower: true });
            }
            // Merge the existing hotel data with updated data, keeping id, slug, and images at the top
            const updatedHotel = {
                id: existingHotel.id,
                slug: updatedData.slug || existingHotel.slug,
                images: existingHotel.images,
                ...existingHotel,
                ...updatedData, // Apply the updated fields from the request body
            };
            await promises_1.default.writeFile(hotelPath, JSON.stringify(updatedHotel, null, 2) // Ensure proper JSON formatting
            );
            return res.status(200).json(updatedHotel);
        }
        catch (error) {
            console.error('Error updating hotel:', error);
            return res.status(404).json({ error: 'Hotel not found' });
        }
    }
    // Upload images
    async uploadImages(req, res) {
        try {
            const { hotelId } = req.body;
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }
            const hotelPath = path_1.default.join(DATA_DIR, `${hotelId}.json`);
            const hotelData = await promises_1.default.readFile(hotelPath, 'utf-8');
            const hotel = JSON.parse(hotelData);
            const imageUrls = files.map(file => `/uploads/images/${file.filename}`);
            hotel.images = [...hotel.images, ...imageUrls];
            await promises_1.default.writeFile(hotelPath, JSON.stringify(hotel, null, 2));
            return res.status(200).json({ images: imageUrls });
        }
        catch (error) {
            console.error('Error uploading images:', error);
            return res.status(500).json({ error: 'Failed to upload images' });
        }
    }
    // Get all hotels
    async getAllHotels(req, res) {
        try {
            const files = await promises_1.default.readdir(DATA_DIR);
            const hotels = [];
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const hotelData = await promises_1.default.readFile(path_1.default.join(DATA_DIR, file), 'utf-8');
                    hotels.push(JSON.parse(hotelData));
                }
            }
            return res.status(200).json(hotels);
        }
        catch (error) {
            console.error('Error getting hotels:', error);
            return res.status(500).json({ error: 'Failed to get hotels' });
        }
    }
}
exports.HotelController = HotelController;
