import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { HotelController } from '../controllers/hotelController';
import { validateHotel } from '../middleware/validation';

const router = Router();
const hotelController = new HotelController();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/images'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post('/hotel', validateHotel, hotelController.createHotel);
router.get('/hotel/:hotelId', hotelController.getHotel);
router.put('/hotel/:hotelId', validateHotel, hotelController.updateHotel);
router.post('/images', upload.array('images'), hotelController.uploadImages);
router.get('/hotels', hotelController.getAllHotels);

export default router;