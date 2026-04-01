# 🚀 URL Shortener Backend Service

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Redis-Caching-red?style=for-the-badge&logo=redis" />
  <img src="https://img.shields.io/badge/Docker-Container-blue?style=for-the-badge&logo=docker" />
  <img src="https://img.shields.io/badge/API-REST-orange?style=for-the-badge" />
</p>

---

## 📌 Introduction

This project is a **scalable URL Shortener Backend Service** built using modern backend technologies.
It allows users to convert long URLs into short, shareable links and efficiently redirect them using high-performance caching.

The system is designed with **clean architecture, scalability, and performance optimization** in mind, making it suitable for real-world backend systems.

---

## 🎯 What This Project Does

```
User Request → API Server → Database + Cache → Short URL Generated
                                  ↓
                          Fast Redirect using Redis
```

### Key Functionalities:

* 🔗 Convert long URLs into short URLs
* ⚡ Fast redirection using Redis caching
* 📦 Store URL mappings in MongoDB
* 🚫 Prevent abuse using rate limiting
* 🐳 Containerized using Docker

---

## 🧠 System Architecture

```
Client → Routes → Controller → Service → Database (MongoDB)
                                     ↘ Cache (Redis)
```

### Flow:

1. Request comes to API
2. Controller validates input
3. Service handles business logic
4. Data stored in MongoDB
5. Frequently accessed data cached in Redis

---

## 🏗️ Project Structure

```
url-shortener/
│
├── src/
│   ├── config/         # DB & Redis connections
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # MongoDB schema
│   ├── routes/         # API routes
│   ├── middlewares/    # Rate limiter & error handler
│   ├── utils/          # Helper functions
│   └── app.js          # Entry point
│
├── .env                # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas
* **Cache:** Redis (Docker)
* **Containerization:** Docker
* **Others:** NanoID, Express Rate Limit

---

## 🔥 Core Features

### 1. URL Shortening

* Generates unique short codes using NanoID
* Stores mapping in MongoDB

---

### 2. Redis Caching (Cache-Aside Pattern)

* First checks Redis
* If not found → fetch from DB → update cache

---

### 3. Rate Limiting

* Prevents API abuse
* Limits number of requests per user/IP

---

### 4. Error Handling

* Centralized error middleware
* Clean and consistent API responses

---

## 🚀 API Endpoints

### 🔹 Create Short URL

```
POST /shorten
```

**Request:**

```json
{
  "longUrl": "https://google.com"
}
```

**Response:**

```json
{
  "shortUrl": "http://localhost:5000/abc123"
}
```

---

### 🔹 Redirect URL

```
GET /:shortCode
```

👉 Redirects to original URL

---

## 🐳 Running with Docker (Redis)

```bash
docker run -d -p 6379:6379 --name redis-server redis
```

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

---

## 📈 Future Enhancements

* 📊 Click Analytics API
* ⏳ URL Expiry (TTL)
* ✏️ Custom Short URLs
* 🌍 Deployment (AWS / Render)
* 📊 Dashboard for analytics

---

## 💡 Key Learnings

* Designing scalable backend architecture
* Implementing caching strategies
* Working with NoSQL databases
* Handling real-world API performance issues
* Using Docker for service management

---

## 👨‍💻 Author

**Rajratan Rajput**
GitHub: https://github.com/rajratan-rajput

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
