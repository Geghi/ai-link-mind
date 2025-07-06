# LinkMindAI - Project Context

## Project Plan: Web Scraping + Kafka Queue + Indexing + Chatbot AI

### Overall Goal
To build an intuitive web app where a user can input a URL, and the system will perform background scraping of all related pages, index the content into a semantic search engine, and provide an intelligent chat interface to query that knowledge base.

---

## User Workflow

1.  The user enters a URL, which triggers an API call and creates a master task.
2.  A scraping job starts, discovers all pages on the site, saves data in db, creates embeddings and save to vector db.
3.  The frontend displays a monitoring dashboard showing the list of urls.
4.  The task status is updated in the UI using supabase realtime.
6.  the user can start a chat for the current website.
7.  The user can now ask questions, and the chatbot will provide answers based on the newly indexed knowledge base for that site.

---

## Technical Stack

Frontend: React, hosting su Cloudflare Pages
Backend API: Next.js + Azure Functions
DB metadata: Supabase (used for real-time updates to the frontend via its Realtime feature)
Vector DB: Pinecone
Job di scraping: Azure Functions
