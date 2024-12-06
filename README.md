# chatOllama

## Description

chatOllama is a mimic of ChatGPT that uses generative models to generate responses to user input based on the conversation's context. The project is built using React with TypeScript, Express.js, Prisma, Ollama, and Tailwind CSS & Shadcn/UI.

## Prerequisites

- Node.js (v21.6.2)
- npm (v10.5.0)
- Docker but not required

## Installation

Clone the repository:

```bash
git clone <repo>
```

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Navigate to the frontend folder and install dependencies:

```bash
cd ../frontend
npm install
```

## Usage

To start the backend server, navigate to `backend/prisma` and create a `.env` file with the following content:

```.env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<databaseName>?schema=public"
```

Then, run the following commands:

```bash
npx prisma migrate dev
npx prisma generate
cd ..
npm run dev
```

To start the frontend server, run the following commands:

```bash
cd frontend
npm run dev
```

## AI Model

The AI model used in this project is Ollama, a generative model that generates responses to user input based on the conversation's context. For this project, we will use llama3.2.

To run the model, you need to install Ollama. This can be done using Docker.

In this repository, there is an `ollama.sh` script that will help you run the model:

```bash
./ollama.sh
```

This script will download the model and run it in a Docker container, utilizing your GPU if available.

## UML Diagram

- [Class Diagram](diagram01.png)
