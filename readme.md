# Second Hand - API

This repository is the Back-End part from Final Project of Independent Study at Binar Academy X Kampus Merdeka - Fullstack Web Course. 

Secondhand is website application that provide a convenient platform for people who want to sell or find used goods. This repository contains API that handle CRUD user, product, wishlist, transaction history, notification, and many more.

# Getting Started

First of all, install all the node modules with :

```sh
npm install
```

After that, create `.env` file whose contents are the same as [`.env-example`](.env-example), but fill it with your own. For instance,

```sh
JWT_PRIVATE_KEY = araara
DB_USER = postgres
DB_PASSWORD = 12345
DB_NAME = MyDatabase
DB_HOST = 127.0.0.1
DB_PORT = 5432
NODE_ENV = development
CLOUD_NAME = 
API_KEY =
API_SECRET =
```
Where CLOUD_NAME, API_KEY, and API_SECRET are environment from [`cloudinary`](http://cloudinary.com) for Media Handling. To run the server, just run the script `dev` inside [`package.json`](package.json) file with : 

```sh
npm run dev
```

# Bookmarks
[`Application Deployment URL`](https://second-hand-be.herokuapp.com/)
[`Open API Documentation`](https://second-hand-be.herokuapp.com/documentation)
[`Entity Relationship Diagram (ERD)`](https://dbdiagram.io/d/62a8b0579921fe2a960493c5)
