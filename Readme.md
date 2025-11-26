🏋️‍♂️ HealthJourn – Social Fitness Journal

HealthJourn is a full-stack social fitness journaling platform where users can track workouts, share progress, interact through posts, follow friends, and build healthy habits together.
Built with FastAPI + React, this project focuses on performance, clean UI, and real-world social features.

🚀 Features
✅ Authentication

Secure JWT-based login & registration

Protected routes

Persistent sessions

✅ User Profile

Edit profile details

Upload profile picture with Cloudinary

Instant UI updates

✅ Posts System

Create text, image, video, and GIF posts

Like & unlike posts

Delete your own posts

✅ Comments System

Add & delete comments

Like & unlike comments

Live comment count updates

✅ Social Feed

Instagram-style vertical feed

Pinterest-style masonry feed

Click-to-preview full post (image/video modal)

✅ Friends System

Follow & unfollow users

Friend suggestions

Friend profile view with posts

Accepted friendships system

✅ Workout Log (Private)

Log personal workouts

View your workout history

Private visibility (only you can see)

🛠 Tech Stack
Frontend:

React

Tailwind CSS

Axios

React Router

Backend:

FastAPI

SQLModel + SQLite

JWT Authentication

Cloudinary (media upload)

📂 Project Structure (Simplified)
Backend
backend/
 ├── app/
 │   ├── models/
 │   ├── routes/
 │   ├── utils/
 │   ├── database.py
 │   └── main.py
 └── venv/

Frontend
frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── context/
 │   ├── App.jsx
 │   └── main.jsx

⚙️ Setup Instructions
🔹 Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload

🔹 Frontend Setup
cd frontend
npm install
npm run dev

🌐 Environment Variables

Create a .env file in the backend:

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
JWT_SECRET_KEY=your_secret_key

✅ Current Status

✅ Core System: Completed
✅ Social Features: Completed
✅ Media Uploads: Completed
✅ Workout Log: Completed
🚧 Future Version (Planned):

Calories tracking

AI workout & nutrition suggestions

Progress charts

Public workout sharing

📸 Screenshots

(Add screenshots here later for max GitHub drip)

🧠 Dev Notes

This project was built as a real-world full-stack social fitness app, not just a CRUD demo.
It includes:

Auth

Upload systems

Social graph (friends)

Feed algorithms

Stateful UI

Secure backend protection

🧑‍💻 Author

Built by Noel
Engineering Student | Full-Stack Dev | Fitness-Tech Enthusiast 💪
GitHub: (add your profile link)