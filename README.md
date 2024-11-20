# Hotel Management API  
This is a backend API built with Node.js, Express.js, and TypeScript for managing hotel details. The API allows users to insert, update, retrieve, and upload images for hotels. All hotel data is stored in JSON files, and images are stored in a designated directory.


## Table of Contents  
Project Overview  
Technologies Used  
Setup Instructions  
Running the Application  
API Endpoints  
Testing  
Error Handling  
Contributing  
License  


### Project Overview  
### The Hotel Management API provides the following features:  

Insert a new hotel record using a POST request (/hotel).  
Upload multiple images for a hotel via a POST request (/images).  
Retrieve detailed hotel information by ID or slug using a GET request (/hotel/{hotel-id}).  
Update hotel information using a PUT request (/hotel/{hotel-id}).  
The project is designed to follow RESTful principles, with validation and error handling to ensure data integrity.  

### Technologies Used  
Node.js: JavaScript runtime for building the API.  
Express.js: Web framework for routing and handling HTTP requests.  
TypeScript: For strict typing and better development practices.  
Slugify: For generating slugs based on hotel titles.  
Multer: For handling file uploads (images).  
Jest: For writing unit tests.  
ESLint: For enforcing coding conventions  


### 1. Setup Instructions  
Follow these steps to set up the project locally:

```
git clone https://github.com/uzzalcse/hotel-management-api.git

```

Go to the directory
```
cd hotel-management-api
```

### 2. Install Dependencies

Run the following command to install all necessary dependencies:  
```
npm install

```

### 3. Run the project on development server

```
npm run dev
```

By default, the server will be available at http://localhost:3001.  

### API Endpoints  
#### 1. POST /hotel 
Insert a new hotel record.

{
  "title": "hotel awesomeka",
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
      "roomTitle": "this is new from put",
      "bedroomCount": 2
    }
  ]
}  


Response:  

Status 201: Hotel created successfully.  
Status 400: Bad request if validation fails.  

#### 2. POST /images  
Upload multiple images for a hotel.  

Form Data:  

images[]: An array of image files (multipart form data).  
Response:  

Status 200: Images uploaded successfully.  
Status 400: Bad request if validation fails.  
3. GET /hotel/{hotel-id}  
Retrieve a specific hotel by ID or slug.  

Response:  

Status 200: Returns the hotel data along with image URLs.  
Status 404: Hotel not found.  


#### 4. PUT /hotel/{hotel-id}    

 {
  "title": "hotel awesomeka",
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
      "roomTitle": "this is new from put",
      "bedroomCount": 2
    }
  ]
}  

#### Response:  

Status 200: Hotel updated successfully.  
Status 400: Bad request if validation fails.  
Status 404: Hotel not found.  

#### Testing  
Unit tests for all critical API functionality are written using Jest.  

#### Run Tests  
To run the tests, execute the following command:  

npm test  

This will run all test cases, including validation, CRUD operations, and error handling.  

#### Error Handling  
The application handles errors gracefully and returns appropriate status codes:  

400: Bad Request (e.g., validation errors).  
404: Not Found (e.g., hotel not found).  
500: Internal Server Error (e.g., unexpected server issues).  

## Contributing  
If you'd like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request. Please follow the coding conventions and write tests for any new features.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
