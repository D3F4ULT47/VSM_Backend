## 🎥 VSM – Video Streaming Platform (Backend)

* A YouTube-inspired backend system focused on user management, subscriptions, and data aggregation using MongoDB and Mongoose.

## 🚧 Project Status

**Under Developement**

* Video uploading module: pending

* Community / engagement features: pending

* Core backend architecture: implemented

## 📌 Overview

VSM is a backend-driven video streaming platform designed to replicate core user-centric functionalities commonly found in platforms like YouTube. The project primarily focuses on authentication, user profiles, subscriptions, watch history, and efficient data aggregation using MongoDB pipelines.

This repository emphasizes clean backend architecture, scalable data modeling, and optimized aggregation responses.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (Access & Refresh tokens)
- **Media Storage:** Cloudinary (image upload & URL management)
- **File Upload Middleware:** Multer

## ✨ Features Implemented

**(🔐 Authentication & User Management)**

* User registration

* Login / Logout

* Secure session handling

* Update user account details:

Avatar

Cover image

Username

Full name

Other profile attributes

* 📺 Channel & Subscription System

* View subscriber count of other users (channels)

* Subscribe / unsubscribe functionality

Check:

* Channels the user has subscribed to

* Subscriber count for a given channel

🕒 Watch History

* Track user watch history

* Fetch complete watch history using optimized queries

⚙️ Backend & Database Design
🧠 MongoDB + Mongoose

Well-structured schemas for:

* Users

* Subscriptions [collections that has documents each of them contains every pair of channel(user) & subscriber(user)]

* Watch history

* Relationship handling using ObjectIds

## 🔄 Aggregation Pipelines

This project heavily uses Mongoose aggregation pipelines to handle complex queries such as:

* Fetching subscribed channels

* Calculating subscriber counts

* Populating nested user/channel data

Optimizations Applied:

* $lookup (for relational joins)

* $project (to limit response payload)

* $addFields (to flatten nested data)

Efficient response shaping for frontend consumption


## 🧩 Folder Structure (High Level)
 
VSM_Backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
└── app.js

🚀 Future Enhancements

* Video upload & streaming pipeline

* Likes, comments, and community posts

* Recommendation system

* Search & discovery

* Analytics dashboard
