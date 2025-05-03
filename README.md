# Blog App API


## Overview
Welcome to the Blog App API – a RESTful backend built with Node.js, Express.js, and MongoDB. This API empowers writers to create, manage, and publish blog posts with ease. Designed for speed, security, and scalability, it's an ideal foundation for your blogging platform.

## Features
User Authentication: Provide sign-up and login for users.

CRUD Operations: Create, read, update, and delete blog posts.

---

## Tech Stack
Backend: Node.js with Express.js

Database: MongoDB with Mongoose

Environment Variables: Managed using .env files

Getting Started
Prerequisites
Ensure you have the following installed:

Node.js (v18 or higher)

MongoDB (local or MongoDB Atlas)

---

Installation
Clone the repository:

```
mkdir blog-app
cd blog-app
git clone https://github.com/anmol111pal/blog-app-api.git
```


Install dependencies:

```npm install```


Set up environment variables:

Create a .env file in the root directory and add the following:

MONGODB_URI=mongodb://127.0.0.1:27017/blog-app

Start the application:


```npm run build && npm run start```


The server will run on http://localhost:5000.

---

API Endpoints


Authentication

POST ```/api/users/register```: Register a new user.

POST ```/api/users/login```: Log in and receive a JWT.


Blog Posts

GET ```/api/posts```: Retrieve all published posts (supports pagination and sorting).

GET ```/api/posts/:id```: Retrieve a single post by ID.

POST ```/api/posts```: Create a new blog post (authentication required).

PUT ```/api/posts/:id```: Update an existing post (authentication required).

DELETE ```/posts/:id```: Delete a post (authentication required).

---

Follow me on my socials:

* [Linkedin](https://www.linkedin.com/in/anmol-pal/)

* [Github](https://github.com/anmol111pal)

* [Dev.to](https://dev.to/anmol111pal)

* [X/Twitter](https://x.com/anmol111pal)
