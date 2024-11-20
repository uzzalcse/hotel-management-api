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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const TEST_DATA_DIR = path_1.default.join(__dirname, '../data/hotels');
const TEST_UPLOADS_DIR = path_1.default.join(__dirname, '../uploads/images');
const TEST_IMAGES_DIR = path_1.default.join(__dirname, 'test-images');
describe('Hotel API', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.mkdir(TEST_UPLOADS_DIR, { recursive: true });
        yield promises_1.default.mkdir(TEST_IMAGES_DIR, { recursive: true });
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield promises_1.default.rm(TEST_DATA_DIR, { recursive: true, force: true });
            yield promises_1.default.rm(TEST_UPLOADS_DIR, { recursive: true, force: true });
            yield promises_1.default.mkdir(TEST_UPLOADS_DIR, { recursive: true });
        }
        catch (error) {
            console.error('Error during test setup:', error);
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield promises_1.default.rm(TEST_IMAGES_DIR, { recursive: true, force: true });
    }));
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
        it('should create a new hotel', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(sampleHotel);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(sampleHotel.title);
            expect(response.body.slug).toBe('test-hotel');
            expect(response.body.rooms[0].hotelSlug).toBe('test-hotel');
            expect(response.body.rooms[0].roomSlug).toBe('deluxe-room');
        }));
    });
    describe('GET /api/hotel/:hotelId', () => {
        it('should retrieve a hotel by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(sampleHotel);
            const hotelId = createResponse.body.id;
            const getResponse = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/hotel/${hotelId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.body.title).toBe(sampleHotel.title);
        }));
        it('should return 404 for non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
            const hotelId = 'randomid';
            const getResponse = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/hotel/${hotelId}`);
            expect(getResponse.status).toBe(404);
        }));
    });
    describe('PUT /api/hotel/:hotelId', () => {
        it('should update a hotel', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(sampleHotel);
            const hotelId = createResponse.body.id;
            const updatedData = {
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
            const updateResponse = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/hotel/${hotelId}`)
                .send(updatedData);
            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body.title).toBe(updatedData.title);
            expect(updateResponse.body.slug).toBe('hotel-awesome-in-dhaka');
            expect(updateResponse.body.rooms[0].hotelSlug).toBe('hotel-awesome-in-dhaka');
            expect(updateResponse.body.rooms[0].roomSlug).toBe('ocean-view-suite');
        }));
        it('should return 404 for updating non-existent hotel', () => __awaiter(void 0, void 0, void 0, function* () {
            const hotelId = 'jljsldkf';
            const updatedData = {
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
            const updateResponse = yield (0, supertest_1.default)(app_1.default)
                .put(`/api/hotel/${hotelId}`)
                .send(updatedData);
            expect(updateResponse.status).toBe(404);
            expect(updateResponse.body.error).toBe('Hotel not found');
        }));
    });
    describe('POST /api/images', () => {
        it('should upload images for a hotel', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(sampleHotel);
            const hotelId = createResponse.body.id;
            const testImage1Path = path_1.default.join(TEST_IMAGES_DIR, 'Image1.jpg');
            const testImage2Path = path_1.default.join(TEST_IMAGES_DIR, 'Image2.jpg');
            // console.log(testImage2Path);
            yield promises_1.default.writeFile(testImage1Path, 'fake image content 1');
            yield promises_1.default.writeFile(testImage2Path, 'fake image content 2');
            const uploadResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/images')
                .field('hotelId', hotelId)
                .attach('images', testImage1Path)
                .attach('images', testImage2Path);
            expect(uploadResponse.status).toBe(200);
            expect(uploadResponse.body.images).toHaveLength(2);
            expect(uploadResponse.body.images[0]).toContain('/uploads/images/');
            expect(uploadResponse.body.images[1]).toContain('/uploads/images/');
            // Verify that the images were added to the hotel
            const getResponse = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/hotel/${hotelId}`);
            expect(getResponse.body.images).toHaveLength(2);
            expect(getResponse.body.images[0]).toContain('/uploads/images/');
            expect(getResponse.body.images[1]).toContain('/uploads/images/');
        }));
        it('should return 400 if no files are uploaded', () => __awaiter(void 0, void 0, void 0, function* () {
            const createResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(sampleHotel);
            const hotelId = createResponse.body.id;
            const uploadResponse = yield (0, supertest_1.default)(app_1.default)
                .post('/api/images')
                .field('hotelId', hotelId);
            expect(uploadResponse.status).toBe(400);
            expect(uploadResponse.body.error).toBe('No files uploaded');
        }));
    });
    describe('GET /api/hotels', () => {
        it('should retrieve all hotels', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(sampleHotel);
            const anotherHotel = Object.assign(Object.assign({}, sampleHotel), { title: 'Test Hotel', description: 'Another test hotel for testing' });
            yield (0, supertest_1.default)(app_1.default)
                .post('/api/hotel')
                .send(anotherHotel);
            const getAllResponse = yield (0, supertest_1.default)(app_1.default)
                .get('/api/hotels');
            expect(getAllResponse.status).toBe(200);
            expect(getAllResponse.body).toHaveLength(2);
            expect(getAllResponse.body[0].title).toBe(sampleHotel.title);
            expect(getAllResponse.body[1].title).toBe(anotherHotel.title);
        }));
        it('should return an empty array if no hotels exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const getAllResponse = yield (0, supertest_1.default)(app_1.default)
                .get('/api/hotels');
            expect(getAllResponse.status).toBe(200);
            expect(getAllResponse.body).toEqual([]);
        }));
    });
});
