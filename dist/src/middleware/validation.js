"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHotel = void 0;
const express_validator_1 = require("express-validator");
exports.validateHotel = [
    (0, express_validator_1.body)('title').notEmpty().trim().isString(),
    (0, express_validator_1.body)('description').notEmpty().trim().isString(),
    (0, express_validator_1.body)('guestCount').isInt({ min: 1 }),
    (0, express_validator_1.body)('bedroomCount').isInt({ min: 1 }),
    (0, express_validator_1.body)('bathroomCount').isInt({ min: 1 }),
    (0, express_validator_1.body)('amenities').isArray(),
    (0, express_validator_1.body)('host.name').notEmpty().trim().isString(),
    (0, express_validator_1.body)('host.email').isEmail(),
    (0, express_validator_1.body)('address').notEmpty().trim().isString(),
    (0, express_validator_1.body)('location.latitude').isFloat(),
    (0, express_validator_1.body)('location.longitude').isFloat(),
    (0, express_validator_1.body)('rooms').isArray(),
    (0, express_validator_1.body)('title').optional().isString().withMessage('Title must be a string'),
    (0, express_validator_1.body)('guestCount').optional().isInt({ min: 1 }).withMessage('Guest count must be a positive integer'),
    (0, express_validator_1.body)('bedroomCount').optional().isInt({ min: 1 }).withMessage('Bedroom count must be a positive integer'),
    (0, express_validator_1.body)('bathroomCount').optional().isInt({ min: 1 }).withMessage('Bathroom count must be a positive integer'),
    (0, express_validator_1.body)('host.name').optional().isString().withMessage('Host name must be a string'),
    (0, express_validator_1.body)('host.email').optional().isEmail().withMessage('Host email must be valid'),
    (0, express_validator_1.body)('address').optional().isString().withMessage('Address must be a string'),
    (0, express_validator_1.body)('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    (0, express_validator_1.body)('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    (0, express_validator_1.body)('rooms').optional().isArray().withMessage('Rooms must be an array'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
