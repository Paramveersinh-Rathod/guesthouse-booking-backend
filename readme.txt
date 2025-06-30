🏠Guest House Booking Backend
This is a full-featured Node.js + MySQL REST API for managing a guest house system, including user authentication, room bookings, payments, admin operations, and reporting

=> Tech Stack
- Backend: Node.js, Express.js
- Database: MySQL (mysql2)
- Auth: JWT-based Authentication
- File Uploads: Multer
- Environment Config: dotenv

=> Features
->Public/User Features
- Signup & login (JWT)
- Browse rooms and pricing
- Make a booking
- Initiate and verify payment
- View past bookings by phone (mock OTP)

-> Admin/Staff Features
- Add/update/delete rooms
- Set room prices by date range
- Upload room images
- Handle walk-in bookings
- View all bookings
- Create & list staff users

-> Reports:
- Total revenue
- Frequent customers
- Room-wise occupancy

📂 Project Structure
guesthouse-booking-backend/
├── controllers/
├── routes/
├── middlewares/
├── config/
├── uploads/            # Uploaded images
├── .env
├── .gitignore
├── app.js
└── server.js

⚙️ Setup Instructions
1. Clone the repo
git clone https://github.com/Paramveersinh-Rathod/guesthouse-booking-backend.git
cd guesthouse-booking-backend

2. Install dependencies
npm install

3. Create a .env file
Create your .env file (use .env.example as a reference):

PORT=8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=guesthouse
JWT_SECRET=your_jwt_secret

4. Run the server
npm start
Server will run at:
📍 http://localhost:8000/

5. API Testing
Use Postman to test endpoints.
Make sure to pass Authorization: Bearer <token> in protected routes.

🗃️ "guesthouse" Database
=> Tables
users
rooms
room_prices
room_photos
bookings
payments

📸 File Uploads
Images uploaded via /api/admin/rooms/upload-image are stored in /uploads
Use: http://localhost:8000/uploads/<filename>

🛡 Auth Tokens
JWT tokens are returned on login and must be sent in headers:
Authorization: Bearer <your_token>

Made by Paramveersinh Rathod
