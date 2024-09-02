# Social Network API

## Table of Contents
- [Description](#description)
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Mock-Up](#mock-up)
- [Installation](#installation)
- [Usage](#usage)
- [Key Features](#key-features)
- [Technologies](#technologies)
- [Repository Link](#repository-link)
- [Video Application](#video-application)

## Description
I will create an API for a social network using MongoDB and Mongoose ODM. In this application, users will be able to share their thoughts, react to friends' thoughts, and create friend lists. Express.js will be used as the basis for routing. The project will also require implementing various CRUD operations to manage users, thoughts, reactions to thoughts, and friend lists.

## User Story

```md
AS A social media startup
I WANT an API for my social network that uses a NoSQL database
SO THAT my website can handle large amounts of unstructured data
```

## Acceptance Criteria

```md
GIVEN a social network API
WHEN I enter the command to invoke the application
THEN my server is started and the Mongoose models are synced to the MongoDB database
WHEN I open API GET routes in Insomnia for users and thoughts
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete users and thoughts in my database
WHEN I test API POST and DELETE routes in Insomnia
THEN I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list
```

## Mock-Up

The following animations show examples of the application's API routes being tested in Insomnia.

The following animation shows GET routes to return all users and all thoughts being tested in Insomnia:

![The following animation shows GET routes to return all users and all thoughts being tested in Insomnia.](./assets/images/18-nosql-homework-demo-01.gif)

The following animation shows GET routes to return a single user and a single thought being tested in Insomnia:

![The following animation shows GET routes to return a single user and a single thought being tested in Insomnia](./assets/images/18-nosql-homework-demo-02.gif)

The following animation shows the POST, PUT, and DELETE routes for users being tested in Insomnia:

![The following animation shows the POST, PUT, and DELETE routes for users being tested in Insomnia](./assets/images/18-nosql-homework-demo-03.gif)

The following animation shows the POST and DELETE routes for a user’s friend list being tested in Insomnia:

![The following animation shows the POST and DELETE routes for a user’s friend list being tested in Insomnia](./assets/images/18-nosql-homework-demo-04.gif)

## Installation

To install the application, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
3. Install the dependencies:
   ```bash
   npm install
4. Make sure MongoDB is installed and running on your machine.
5. Create a `.env` file in the root directory and add your MongoDB connection string.

## Usage

1. Use the following command to seed the MongoDB database.
   ```bash
   npm run seed
2. Start the server:
   ```bash
   npm start
3. Use a tool like Insomnia to test the API routes.

## Key Features

- Uses MongoDB as the database with Mongoose as the ODM.
- Stores and manages unstructured data efficiently.
- Includes RESTful CRUD operations for users and thoughts.
- Supports friend relationships and reactions as subdocuments within thoughts.

## Technologies

- Node.js - runtime environment.
- Express.js - web framework for Node.js.
- MongoDB - NoSQL database.
- Mongoose - ODM for MongoDB.
- dotenv - for managing environment variables.

## Repository Link
[Social Network API Repository](https://github.com/iKeyToLife/Social-Network-API)

## Video Application
[Social Network API Video Application]()