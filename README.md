# AI-Powered Document Chat Application

A full-stack web application that allows users to upload documents and chat with an AI assistant that can answer questions based on the uploaded content. Built with React, Node.js, Supabase, and OpenAI.

## 🚀 What the App Does

This application provides an intelligent document chat interface where users can:

- **Upload Documents**: Support for various file formats (PDF, TXT, etc.)
- **AI-Powered Chat**: Interact with an AI assistant that understands your uploaded documents
- **Document Management**: View, download, and delete uploaded files
- **Secure Authentication**: User registration and login with Supabase Auth
- **Real-time Chat**: Seamless conversation with AI based on document content

## 🤖 AI Model Training

The AI model used in this application has been fine-tuned on a custom dataset for customer service interactions. The training data is located in the root directory:

- **`bitext_customer_service_openai_finetune.jsonl`** - Custom training dataset used to fine-tune the OpenAI model for customer service scenarios
- **`sample1.txt`** and **`sample2.txt`** - Sample customer service conversations and guidelines

This fine-tuning enables the AI to provide more accurate, contextually appropriate, and brand-aligned responses for customer service interactions.

### Key Features

- 📄 **Document Upload & Storage**: Secure file upload with Supabase Storage
- 🤖 **AI Chat Interface**: Powered by OpenAI GPT-4 for intelligent responses
- 🔐 **User Authentication**: Secure login/signup with Supabase Auth
- 📱 **Responsive Design**: Modern UI built with React and Tailwind CSS


## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Supabase Auth UI** - Pre-built authentication components
- **Vitest** - Unit testing framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **OpenAI API** - AI chat completions
- **Multer** - File upload handling
- **Cookie Parser** - Cookie management
- **CORS** - Cross-origin resource sharing
- **JWT** - JSON Web Token authentication
- **Vitest** - Unit testing framework
- **Supertest** - HTTP testing library

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** - For database, auth, and storage
- **OpenAI API Key** - For AI chat functionality

## 🚀 How to Set Up Locally

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd FullStackProject
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_PUBLIC_SUPABASE_URL=your_supabase_url
VITE_PUBLIC_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:

**users** (handled by Supabase Auth)
**filesData**:
```sql
CREATE TABLE filesData (
  id SERIAL PRIMARY KEY,
  userID UUID REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  supabase_path TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**ChatHistory**:
```sql
CREATE TABLE ChatHistory (
  id SERIAL PRIMARY KEY,
  userID UUID REFERENCES auth.users(id),
  chat_history JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

3. Create a storage bucket named `files-for-vector`
4. Set up Row Level Security (RLS) policies

### 5. Run the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🧪 Testing

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

### Test Structure

**Backend Tests:**
- `__tests__/server.test.js` - Server route tests (4 tests)
- `__tests__/auth.test.js` - Authentication middleware tests (3 tests)

**Frontend Tests:**
- `src/__tests__/App.test.jsx` - Main App component test (2 tests)
- `src/__tests__/components.test.jsx` - Component rendering tests (3 tests)
- `src/__tests__/pages.test.jsx` - Page component tests (2 tests)
- `src/__tests__/utils.test.js` - Utility function tests (3 tests)

**Total Tests:** 17 tests (7 backend + 10 frontend)

### Test Examples

**Backend Route Test:**
```javascript
it('should return hello message', async () => {
  const response = await request(app).get('/')
  expect(response.status).toBe(200)
  expect(response.body.message).toBe('Hello World! Server is running.')
})
```

**Frontend Component Test:**
```javascript
it('renders header component', () => {
  renderWithRouter(<Header />)
  expect(screen.getByRole('banner')).toBeDefined()
})
```

**Frontend Utility Test:**
```javascript
it('should validate email format', () => {
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  expect(isValidEmail('test@example.com')).toBe(true)
  expect(isValidEmail('invalid-email')).toBe(false)
})
```

## 🌐 Live Links

- **Frontend**: [Your deployed frontend URL]
- **Backend**: [Your deployed backend URL]

## 📡 API Routes

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat Routes
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get chat history

### File Management Routes
- `PUT /api/chat/upload` - Upload document
- `GET /api/chat/files` - Get user's files
- `GET /api/chat/download/:id` - Download file
- `DELETE /api/chat/files/:id` - Delete file

### Health Check
- `GET /` - Server status
- `GET /health` - Health check endpoint

## 🔌 External APIs Used

### OpenAI API
- **Purpose**: AI chat completions
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Model**: ft:gpt-4.1-nano-2025-04-14:personal:customerdata:BkFPKzdQ
- **Fine-tuned**: Custom model trained on customer service dataset
- **Training Data**: `bitext_customer_service_openai_finetune.jsonl` (22MB dataset)
- **Documentation**: [OpenAI API Docs](https://platform.openai.com/docs)

### Supabase APIs
- **Authentication**: User management and JWT tokens
- **Database**: PostgreSQL database for file metadata and chat history
- **Storage**: File upload and download
- **Documentation**: [Supabase Docs](https://supabase.com/docs)

## 📸 Screenshots

[Add screenshots of your application here]

## 🎥 Demo Video

[Add a link to your demo video here]



### Resources and Documentation

- **[React Documentation](https://react.dev/)**
- **[Vite Documentation](https://vitejs.dev/)**
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)**
- **[Express.js Documentation](https://expressjs.com/)**
- **[Supabase Documentation](https://supabase.com/docs)**
- **[OpenAI API Documentation](https://platform.openai.com/docs)**
- **[React Router Documentation](https://reactrouter.com/)**
- **[Axios Documentation](https://axios-http.com/docs/intro)**
- **[Vitest Documentation](https://vitest.dev/)**
- **[Supertest Documentation](https://github.com/visionmedia/supertest)**





**Built with ❤️ using React, Node.js, Supabase, and OpenAI** 