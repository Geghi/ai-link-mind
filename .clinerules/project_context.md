# LinkMindAI - Project Context

## Project Plan: Web Scraping + Kafka Queue + Indexing + Chatbot AI

### Overall Goal
To build an intuitive web app where a user can input a URL, and the system will perform background scraping of all related pages, index the content into a semantic search engine, and provide an intelligent chat interface to query that knowledge base.

---

## Core Components and Workflows

### 1. Frontend Framework (React + Next.js)
- **Initial Page**: A simple text field for the user to input the URL to be analyzed.
- **Scraping Initiation**: The scraping process is started via an API call.
- **Real-time Monitoring Dashboard**:
  - A list of discovered and analyzed pages with their current status (e.g., Queued, In Progress, Completed).
  - Live updates are pushed to the frontend directly from Supabase via its Realtime capabilities. The frontend subscribes to changes in the `url_entries` table, filtering by `task_id` to show only relevant URLs for the current analysis task.
- **Chat Interface**: Displays all processed sites/URLs and allows the user to select one to open a chat to ask contextual questions for that website.

### 2. Backend API Server
- Exposes REST/GraphQL APIs for:
  - Receiving a URL to process and creating a corresponding scraping task.
  - Updating the processing status of each page, based on API calls from the background workers.
  - Providing real-time data to the frontend for the monitoring dashboard.
  - Managing the chat functionality and semantic search queries.

### 3. Message Queue (Apache Kafka)
- Kafka serves as the central task queue for all processing jobs.
- **Workflow**:
  1. When a user submits a URL, the backend creates a "master task".
  2. A scraping job (e.g., an AWS Lambda function) discovers all pages linked from the initial URL and adds a new task for each page to the Kafka queue. Each task includes a page ID, the URL, and minimal metadata.
  3. Backend workers consume these messages from the Kafka queue to process each document individually.

### 4. Scraping Job (AWS Lambda or Serverless Container)
- Triggered when a new URL is submitted.
- Performs recursive scraping (crawling) of the target website to extract all pages and links.
- For each extracted page:
  - Saves the raw page content to a database (e.g., S3 for the content, with metadata in a relational or NoSQL database).
  - Adds a new task to the Kafka queue with the page/document ID.

### 5. Background Job Worker (Kafka Consumer)
- A service that continuously listens for new messages on the Kafka queue.
- For each message/task received:
  1. Retrieves the raw document (page text) from the database.
  2. Processes the text: cleaning, chunking, etc.
  3. Calculates embeddings for each chunk using the OpenAI (or Azure) API.
  4. Saves the resulting embeddings into a vector database (e.g., Pinecone or Azure Cognitive Search).
  5. Updates the task status via an API call to the backend, which then updates the frontend in real-time.
  6. Manages errors, retries, and logging.

### 6. Databases
- **Document Storage**: AWS S3 or a similar service for storing raw page text.
- **Metadata & Task Status**: A relational (PostgreSQL/MySQL) or NoSQL (MongoDB/DynamoDB) database.
- **Vector DB**: Pinecone or Azure Cognitive Search for storing and querying embeddings.

### 7. Chatbot with Retrieval-Augmented Generation (RAG)
- The frontend sends the user's query to the backend API.
- The backend then:
  1. Transforms the query into an embedding.
  2. Searches for the most relevant chunks in the vector database, filtering by the selected site/URL.
  3. Passes the retrieved chunks along with the original question to an LLM (e.g., OpenAI GPT-4) to generate a contextualized answer.
- The final response is returned to the frontend and displayed in the chat interface.

---

## User Workflow

1.  The user enters a URL, which triggers an API call and creates a master task.
2.  A scraping job starts, discovers all pages on the site, and for each page, creates a Kafka task and saves the document.
3.  The frontend displays a monitoring dashboard showing the list of pages, with live status updates via WebSockets/SSE.
4.  A Kafka worker processes each task from the queue, calculating embeddings and indexing the content.
5.  The task status is updated in the backend, and the frontend UI is updated in real-time.
6.  Once the process is complete, the user can select the URL in the chat interface.
7.  The user can now ask questions, and the chatbot will provide answers based on the newly indexed knowledge base for that site.

---

## Technical Stack

Frontend: React, hosting su Cloudflare Pages
Backend API: Python (FastAPI) con Azure Functions
Coda messaggi: Apache Kafka auto-ospitato
Archiviazione documenti: Cloudflare R2
DB metadata: Supabase (used for real-time updates to the frontend via its Realtime feature, with an external service handling database writes for URL status changes)
DB vettori: Pinecone
Job di scraping: AWS Lambda (con Docker) o Azure Container
Lavoratore job: AWS Lambda (serverless) per task brevi
Backend WebSocket/SSE: FastAPI + SSE
API AI: OpenAI
