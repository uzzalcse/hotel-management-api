"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    createHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelData = req.body;
                const id = 'hotel-' + (0, uuid_1.v4)();
                const hotelSlug = (0, slugify_1.default)(hotelData.title, { lower: true });
                const processedRooms = hotelData.rooms.map((room) => ({
                    hotelSlug,
                    roomSlug: (0, slugify_1.default)(room.roomTitle, { lower: true }),
                    roomImage: room.roomImage,
                    roomTitle: room.roomTitle,
                    bedroomCount: room.bedroomCount
                }));
                const hotel = Object.assign(Object.assign({ id, slug: hotelSlug, images: [] }, hotelData), { rooms: processedRooms });
                yield promises_1.default.mkdir(DATA_DIR, { recursive: true });
                yield promises_1.default.writeFile(path_1.default.join(DATA_DIR, `${id}.json`), JSON.stringify(hotel, null, 2));
                return res.status(201).json(hotel);
            }
            catch (error) {
                console.error('Error creating hotel:', error);
                return res.status(500).json({ error: 'Failed to create hotel' });
            }
        });
    }
    getHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.params;
                const hotelPath = path_1.default.join(DATA_DIR, `${hotelId}.json`);
                // First check if the file exists
                try {
                    yield promises_1.default.access(hotelPath);
                }
                catch (err) {
                    // If the file doesn't exist, return 404
                    return res.status(404).json({ error: 'Hotel not found' });
                }
                // Now that the file exists, read the hotel data
                const hotelData = yield promises_1.default.readFile(hotelPath, 'utf-8');
                const hotel = JSON.parse(hotelData);
                return res.status(200).json(hotel);
            }
            catch (error) {
                console.error('Error getting hotel:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // update hotel
    updateHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.params;
                const hotelPath = path_1.default.join(DATA_DIR, `${hotelId}.json`);
                const updatedData = req.body;
                // Check if the hotel file exists
                try {
                    yield promises_1.default.access(hotelPath);
                }
                catch (err) {
                    // If the file doesn't exist, return 404
                    return res.status(404).json({ error: 'Hotel not found' });
                }
                // Read the existing hotel data
                const existingHotelData = yield promises_1.default.readFile(hotelPath, 'utf-8');
                const existingHotel = JSON.parse(existingHotelData);
                // Update hotel slug if title is provided
                if (updatedData.title) {
                    updatedData.slug = (0, slugify_1.default)(updatedData.title, { lower: true });
                }
                // Update room data if rooms are provided
                if (updatedData.rooms) {
                    updatedData.rooms = updatedData.rooms.map((room) => ({
                        hotelSlug: updatedData.slug || existingHotel.slug,
                        roomSlug: (0, slugify_1.default)(room.roomTitle, { lower: true }),
                        roomImage: room.roomImage,
                        roomTitle: room.roomTitle,
                        bedroomCount: room.bedroomCount
                    }));
                }
                const updatedHotel = Object.assign(Object.assign({}, existingHotel), updatedData);
                yield promises_1.default.writeFile(hotelPath, JSON.stringify(updatedHotel, null, 2));
                return res.status(200).json(updatedHotel);
            }
            catch (error) {
                console.error('Error updating hotel:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    // Upload images
    // async uploadImages(req: Request, res: Response) {
    //   try {
    //     const { hotelId } = req.body;
    //     const files = req.files as Express.Multer.File[];
    //     if (!files || files.length === 0) {
    //       return res.status(400).json({ error: 'No files uploaded' });
    //     }
    //     const hotelPath = path.join(DATA_DIR, `${hotelId}.json`);
    //     const hotelData = await fs.readFile(hotelPath, 'utf-8');
    //     const hotel: Hotel = JSON.parse(hotelData);
    //     const imageUrls = files.map(file => `/uploads/images/${file.filename}`);
    //     hotel.images = [...hotel.images, ...imageUrls];
    //     await fs.writeFile(
    //       hotelPath,
    //       JSON.stringify(hotel, null, 2)
    //     );
    //     return res.status(200).json({ images: imageUrls });
    //   } catch (error) {
    //     console.error('Error uploading images:', error);
    //     return res.status(500).json({ error: 'Failed to upload images' });
    //   }
    // }
    // upload image with validaiton
    uploadImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId } = req.body;
                const files = req.files;
                if (!files || files.length === 0) {
                    return res.status(400).json({ error: 'No files uploaded' });
                }
                // Validate that all files are images
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                const invalidFiles = files.filter(file => !validImageTypes.includes(file.mimetype));
                if (invalidFiles.length > 0) {
                    return res.status(400).json({ error: 'Invalid file type. Only image files are allowed.' });
                }
                const hotelPath = path_1.default.join(DATA_DIR, `${hotelId}.json`);
                let hotel;
                try {
                    const hotelData = yield promises_1.default.readFile(hotelPath, 'utf-8');
                    hotel = JSON.parse(hotelData);
                }
                catch (err) {
                    return res.status(404).json({ error: 'Hotel not found' });
                }
                // Map uploaded image files to URLs
                const imageUrls = files.map(file => `/uploads/images/${file.filename}`);
                // Add the image URLs to the hotel's image list
                hotel.images = [...hotel.images, ...imageUrls];
                // Write the updated hotel data back to the file
                yield promises_1.default.writeFile(hotelPath, JSON.stringify(hotel, null, 2));
                return res.status(200).json({ images: imageUrls });
            }
            catch (error) {
                console.error('Error uploading images:', error);
                return res.status(500).json({ error: 'Failed to upload images' });
            }
        });
    }
    //get all hotels with empty array returns
    getAllHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the DATA_DIR exists
                try {
                    yield promises_1.default.access(DATA_DIR);
                }
                catch (error) {
                    // If the directory doesn't exist, return an empty array
                    return res.status(200).json([]);
                }
                const files = yield promises_1.default.readdir(DATA_DIR);
                const hotels = [];
                for (const file of files) {
                    if (file.endsWith('.json')) {
                        const hotelData = yield promises_1.default.readFile(path_1.default.join(DATA_DIR, file), 'utf-8');
                        hotels.push(JSON.parse(hotelData));
                    }
                }
                // If no hotel files were found, this will return an empty array
                return res.status(200).json(hotels);
            }
            catch (error) {
                console.error('Error getting hotels:', error);
                return res.status(500).json({ error: 'Failed to get hotels' });
            }
        });
    }
}
exports.HotelController = HotelController;
