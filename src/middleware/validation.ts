import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateHotel = [
  body('title').notEmpty().trim().isString(),
  body('description').notEmpty().trim().isString(),
  body('guestCount').isInt({ min: 1 }),
  body('bedroomCount').isInt({ min: 1 }),
  body('bathroomCount').isInt({ min: 1 }),
  body('amenities').isArray(),
  body('host.name').notEmpty().trim().isString(),
  body('host.email').isEmail(),
  body('address').notEmpty().trim().isString(),
  body('location.latitude').isFloat(),
  body('location.longitude').isFloat(),
  body('rooms').isArray(),
  body('title').optional().isString().withMessage('Title must be a string'),
  body('guestCount').optional().isInt({ min: 1 }).withMessage('Guest count must be a positive integer'),
  body('bedroomCount').optional().isInt({ min: 1 }).withMessage('Bedroom count must be a positive integer'),
  body('bathroomCount').optional().isInt({ min: 1 }).withMessage('Bathroom count must be a positive integer'),
  body('host.name').optional().isString().withMessage('Host name must be a string'),
  body('host.email').optional().isEmail().withMessage('Host email must be valid'),
  body('address').optional().isString().withMessage('Address must be a string'),
  body('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('rooms').optional().isArray().withMessage('Rooms must be an array'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


