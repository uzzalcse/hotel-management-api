

import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { Hotel } from '../models/hotelModel';
import { v4 as uuidv4 } from 'uuid';



const DATA_DIR = path.join(__dirname, '../../data/hotels');
const UPLOADS_DIR = path.join(__dirname, '../../uploads/images');

export class HotelController {
 
  async createHotel(req: Request, res: Response) {
    try {
      const hotelData = req.body;
      const id = 'hotel-' + uuidv4();
      const hotelSlug = slugify(hotelData.title, { lower: true });

      const processedRooms = hotelData.rooms.map((room: any) => ({
        hotelSlug,
        roomSlug: slugify(room.roomTitle, { lower: true }),
        roomImage: room.roomImage,
        roomTitle: room.roomTitle,
        bedroomCount: room.bedroomCount
      }));

      const hotel = {
        id,
        slug: hotelSlug,
        images: [],
        ...hotelData,
        rooms: processedRooms
      };

      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(
        path.join(DATA_DIR, `${id}.json`),
        JSON.stringify(hotel, null, 2)
      );

      return res.status(201).json(hotel);
    } catch (error) {
      console.error('Error creating hotel:', error);
      return res.status(500).json({ error: 'Failed to create hotel' });
    }
  }

  async getHotel(req: Request, res: Response) {
    try {
      const { hotelId } = req.params;
      const hotelPath = path.join(DATA_DIR, `${hotelId}.json`);
  
      // First check if the file exists
      try {
        await fs.access(hotelPath);
      } catch (err) {
        // If the file doesn't exist, return 404
        return res.status(404).json({ error: 'Hotel not found' });
      }
  
      // Now that the file exists, read the hotel data
      const hotelData = await fs.readFile(hotelPath, 'utf-8');
      const hotel: Hotel = JSON.parse(hotelData);
  
      return res.status(200).json(hotel);
    } catch (error) {
      console.error('Error getting hotel:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
// update hotel

  async updateHotel(req: Request, res: Response) {
    try {
      const { hotelId } = req.params;
      const hotelPath = path.join(DATA_DIR, `${hotelId}.json`);
      const updatedData: Partial<Hotel> = req.body;
  
      // Check if the hotel file exists
      try {
        await fs.access(hotelPath);
      } catch (err) {
        // If the file doesn't exist, return 404
        return res.status(404).json({ error: 'Hotel not found' });
      }
  
      // Read the existing hotel data
      const existingHotelData = await fs.readFile(hotelPath, 'utf-8');
      const existingHotel: Hotel = JSON.parse(existingHotelData);
  
      // Update hotel slug if title is provided
      if (updatedData.title) {
        updatedData.slug = slugify(updatedData.title, { lower: true });
      }
  
      // Update room data if rooms are provided
      if (updatedData.rooms) {
        updatedData.rooms = updatedData.rooms.map((room: any) => ({
          hotelSlug: updatedData.slug || existingHotel.slug,
          roomSlug: slugify(room.roomTitle, { lower: true }),
          roomImage: room.roomImage,
          roomTitle: room.roomTitle,
          bedroomCount: room.bedroomCount
        }));
      }
  
      const updatedHotel: Hotel = {
        ...existingHotel,
        ...updatedData,
      };
  
      await fs.writeFile(hotelPath, JSON.stringify(updatedHotel, null, 2));
  
      return res.status(200).json(updatedHotel);
    } catch (error) {
      console.error('Error updating hotel:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  


  // Upload images
  

async uploadImages(req: Request, res: Response) {
  try {
    const { hotelId } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Validate that all files are images
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.mimetype));

    if (invalidFiles.length > 0) {
      return res.status(400).json({ error: 'Invalid file type. Only image files are allowed.' });
    }

    const hotelPath = path.join(DATA_DIR, `${hotelId}.json`);
    let hotel: Hotel;

    try {
      const hotelData = await fs.readFile(hotelPath, 'utf-8');
      hotel = JSON.parse(hotelData);
    } catch (err) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Map uploaded image files to URLs
    const imageUrls = files.map(file => `/uploads/images/${file.filename}`);
    
    // Add the image URLs to the hotel's image list
    hotel.images = [...hotel.images, ...imageUrls];

    // Write the updated hotel data back to the file
    await fs.writeFile(hotelPath, JSON.stringify(hotel, null, 2));

    return res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({ error: 'Failed to upload images' });
  }
}


  //get all hotels with empty array returns
  async getAllHotels(req: Request, res: Response) {
    try {
      // Check if the DATA_DIR exists
      try {
        await fs.access(DATA_DIR);
      } catch (error) {
        // If the directory doesn't exist, return an empty array
        return res.status(200).json([]);
      }

      const files = await fs.readdir(DATA_DIR);
      const hotels: Hotel[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const hotelData = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
          hotels.push(JSON.parse(hotelData));
        }
      }

      // If no hotel files were found, this will return an empty array
      return res.status(200).json(hotels);
    } catch (error) {
      console.error('Error getting hotels:', error);
      return res.status(500).json({ error: 'Failed to get hotels' });
    }
  }

}