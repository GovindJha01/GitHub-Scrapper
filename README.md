# GitHub-Scrapper

GitHub-Scrapper is a backend Node.js service that scrapes GitHub user search results and uses an AI API (like OpenAI or Gemini) to analyze and summarize developer profiles.

## 🚀 Features

- GitHub user search scraping
- AI-powered summarization (Gemini)
- Simple backend API

## 📦 Tech Stack
- Node.js
- Express
- Cheerio
- puppeteer
- Gemini for AI summarization 

## 🔧 Installation

1. Clone the repository:
   
   ```bash
   git clone https://github.com/GovindJha01/GitHub-Scrapper.git
   cd GitHub-Scrapper/servver
   ``` 
3. Install dependencies:

   ```bash
   npm i
   ``` 
5. Create a .env file in the \server directory:

   Look for .env.example for reference

## 🧪 Usage
1. Start the backend server
  
   ```bash
   nodemon index.js
   ```
2. Visit the endpoint in postman

   ```bash
   GET http://localhost:3000/analyze/<your_search_query>
   ```

