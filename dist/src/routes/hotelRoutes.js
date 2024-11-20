"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const hotelController_1 = require("../controllers/hotelController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const hotelController = new hotelController_1.HotelController();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../uploads/images'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Routes
router.post('/hotel', validation_1.validateHotel, hotelController.createHotel);
router.get('/hotel/:hotelId', hotelController.getHotel);
router.put('/hotel/:hotelId', validation_1.validateHotel, hotelController.updateHotel);
router.post('/images', upload.array('images'), hotelController.uploadImages);
router.get('/hotels', hotelController.getAllHotels);
exports.default = router;
