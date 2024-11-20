

import request from 'supertest';
import app from '../src/app';
import fs from 'fs/promises';
import path from 'path';

const TEST_DATA_DIR = path.join(__dirname, '../data/hotels');
const TEST_UPLOADS_DIR = path.join(__dirname, '../uploads/images');
const TEST_IMAGES_DIR = path.join(__dirname, 'test-images');


describe('Hotel API', () => {
  beforeAll(async () => {
    await fs.mkdir(TEST_UPLOADS_DIR, { recursive: true });
    await fs.mkdir(TEST_IMAGES_DIR, { recursive: true });
  });

  beforeEach(async () => {
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
      await fs.rm(TEST_UPLOADS_DIR, { recursive: true, force: true });
      await fs.mkdir(TEST_UPLOADS_DIR, { recursive: true });
    } catch (error) {
      console.error('Error during test setup:', error);
    }
  });

  afterAll(async () => {
    await fs.rm(TEST_IMAGES_DIR, { recursive: true, force: true });
  });

  const sampleHotel = {
    title: 'Test Hotel',
    description: 'A beautiful test hotel',
    guestCount: 4,
    bedroomCount: 2,
    bathroomCount: 2,
    amenities: ['wifi', 'parking'],
    host: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    address: '123 Test Street',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    rooms: [
      {
        roomTitle: 'Deluxe Room',
        roomImage: 'deluxe-room.jpg',
        bedroomCount: 1
      }
    ],
  };

  describe('POST /api/hotel', () => {
    it('should create a new hotel', async () => {
      const response = await request(app)
        .post('/api/hotel')
        .send(sampleHotel);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(sampleHotel.title);
      expect(response.body.slug).toBe('test-hotel');
      expect(response.body.rooms[0].hotelSlug).toBe('test-hotel');
      expect(response.body.rooms[0].roomSlug).toBe('deluxe-room');
    });
  });

  describe('GET /api/hotel/:hotelId', () => {
    it('should retrieve a hotel by ID', async () => {
      const createResponse = await request(app)
        .post('/api/hotel')
        .send(sampleHotel);

      const hotelId = createResponse.body.id;

      const getResponse = await request(app)
        .get(`/api/hotel/${hotelId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.title).toBe(sampleHotel.title);
    });

    it('should return 404 for non-existent hotel', async () => {
      const hotelId='randomid';
      const getResponse = await request(app)
        .get(`/api/hotel/${hotelId}`);

      expect(getResponse.status).toBe(404);
    });
  });
  describe('PUT /api/hotel/:hotelId', () => {
    it('should update a hotel', async () => {
      const createResponse = await request(app)
        .post('/api/hotel')
        .send(sampleHotel);

      const hotelId = createResponse.body.id;
      const updatedData = 
      {
        "title": "hotel awesome in dhaka",
        "description": "random text",
        "guestCount": 4,
        "bedroomCount": 2,
        "bathroomCount": 2,
        "amenities": [
          "wifi",
          "pool",
          "spa",
          "beach access",
          "room service"
        ],
        "host": {
          "name": "John Smith",
          "email": "john.smith@resort.com"
        },
        "address": "123 Ocean Drive, Miami Beach, FL 33139",
        "location": {
          "latitude": 25.7617,
          "longitude": -80.1918
        },
        "rooms": [
          {
            "roomImage": "",
            "roomTitle": "Ocean View Suite",
            "bedroomCount": 1
          },
          {
            "roomImage": "",
            "roomTitle": "hell here don't move",
            "bedroomCount": 2
          },
              {
            "roomImage": "",
            "roomTitle": "this is new updation from put",
            "bedroomCount": 2
          }
        ]
      };

      const updateResponse = await request(app)
        .put(`/api/hotel/${hotelId}`)
        .send(updatedData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe(updatedData.title);
      expect(updateResponse.body.slug).toBe('hotel-awesome-in-dhaka');
      expect(updateResponse.body.rooms[0].hotelSlug).toBe('hotel-awesome-in-dhaka');
      expect(updateResponse.body.rooms[0].roomSlug).toBe('ocean-view-suite');
    });

    it('should return 404 for updating non-existent hotel', async () => {
      const hotelId='jljsldkf';
      const updatedData={
        "title": "hotel awesome in dhaka",
        "description": "random text",
        "guestCount": 4,
        "bedroomCount": 2,
        "bathroomCount": 2,
        "amenities": [
          "wifi",
          "pool",
          "spa",
          "beach access",
          "room service"
        ],
        "host": {
          "name": "John Smith",
          "email": "john.smith@resort.com"
        },
        "address": "123 Ocean Drive, Miami Beach, FL 33139",
        "location": {
          "latitude": 25.7617,
          "longitude": -80.1918
        },
        "rooms": [
          {
            "roomImage": "",
            "roomTitle": "Ocean View Suite",
            "bedroomCount": 1
          },
          {
            "roomImage": "",
            "roomTitle": "hell here don't move",
            "bedroomCount": 2
          },
              {
            "roomImage": "",
            "roomTitle": "this is new updation from put",
            "bedroomCount": 2
          }
        ]
      };
      const updateResponse = await request(app)
        .put(`/api/hotel/${hotelId}`)
        .send(updatedData);

      expect(updateResponse.status).toBe(404);
      expect(updateResponse.body.error).toBe('Hotel not found');
    });
  });

  describe('POST /api/images', () => {
    it('should upload images for a hotel', async () => {
      const createResponse = await request(app)
        .post('/api/hotel')
        .send(sampleHotel);

      const hotelId = createResponse.body.id;

      const testImage1Path = path.join(TEST_IMAGES_DIR, 'Image1.jpg');
      const testImage2Path = path.join(TEST_IMAGES_DIR, 'Image2.jpg');

      // console.log(testImage2Path);

      await fs.writeFile(testImage1Path, 'fake image content 1');
      await fs.writeFile(testImage2Path, 'fake image content 2');

      const uploadResponse = await request(app)
        .post('/api/images')
        .field('hotelId', hotelId)
        .attach('images', testImage1Path)
        .attach('images', testImage2Path);

      expect(uploadResponse.status).toBe(200);
      expect(uploadResponse.body.images).toHaveLength(2);
      expect(uploadResponse.body.images[0]).toContain('/uploads/images/');
      expect(uploadResponse.body.images[1]).toContain('/uploads/images/');

      // Verify that the images were added to the hotel
      const getResponse = await request(app)
        .get(`/api/hotel/${hotelId}`);

      expect(getResponse.body.images).toHaveLength(2);
      expect(getResponse.body.images[0]).toContain('/uploads/images/');
      expect(getResponse.body.images[1]).toContain('/uploads/images/');
    });

    it('should return 400 if no files are uploaded', async () => {
      const createResponse = await request(app)
        .post('/api/hotel')
        .send(sampleHotel);

      const hotelId = createResponse.body.id;

      const uploadResponse = await request(app)
        .post('/api/images')
        .field('hotelId', hotelId);

      expect(uploadResponse.status).toBe(400);
      expect(uploadResponse.body.error).toBe('No files uploaded');
    });
  });

  describe('GET /api/hotels', () => {
    it('should retrieve all hotels', async () => {
      await request(app)
        .post('/api/hotel')
        .send(sampleHotel);

      const anotherHotel = {
        ...sampleHotel,
        title: 'Test Hotel',
        description: 'Another test hotel for testing',
      };

      await request(app)
        .post('/api/hotel')
        .send(anotherHotel);

      const getAllResponse = await request(app)
        .get('/api/hotels');

      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toHaveLength(2);
      expect(getAllResponse.body[0].title).toBe(sampleHotel.title);
      expect(getAllResponse.body[1].title).toBe(anotherHotel.title);
    });

    it('should return an empty array if no hotels exist', async () => {
      const getAllResponse = await request(app)
        .get('/api/hotels');

      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toEqual([]);
    });
  });
});
