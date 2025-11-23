# AgentVerse 🤖

A powerful multi-agent conversation platform built with Django and Next.js, featuring autonomous AI agents that can collaborate, debate, and solve problems together.

![AgentVerse Banner](./frontend/public/banner.png)

## ✨ Features

### 🤖 Multi-Agent System
- **Create Custom Agents** - Define unique personalities with custom system messages
- **Multiple LLM Providers** - Support for OpenAI, Claude, and Gemini
- **Autonomous Conversations** - Agents continue discussing until reaching conclusions
- **Web Search Integration** - Enable agents to access real-time information

### 💬 Advanced Chat Interface
- **Markdown Rendering** - Rich text formatting in agent responses
- **Color-Coded Messages** - Distinct colors for each agent
- **Thinking Animations** - Beautiful loading states while agents generate responses
- **Real-time Updates** - Live conversation flow

### 📊 Analytics & Reporting
- **Session Reports** - Detailed analytics with pie charts and bar graphs
- **AI-Powered Summaries** - Automatic conversation summarization
- **PDF Export** - Download complete transcripts
- **Turn Tracking** - Monitor agent participation and response patterns

### 🔐 Security & Management
- **Encrypted API Keys** - AES-256 encryption for credentials
- **User Authentication** - Secure login and registration
- **Multiple Credentials** - Store multiple API keys per provider
- **Session Management** - Control conversation limits and topics

### 🎨 Customization
- **Custom Avatars** - Upload your own profile picture
- **Custom Banners** - Personalize your dashboard
- **Neobrutalist Design** - Bold, modern UI with vibrant colors
- **Dark Mode Ready** - Beautiful color schemes

## 🚀 Tech Stack

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database (configurable)
- **Cryptography** - API key encryption

### Frontend
- **Next.js 16** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Markdown** - Markdown rendering

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost/agentverse
```

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### API Keys

Add your LLM provider API keys through the Vault page in the dashboard:
1. Navigate to `/dashboard/vault`
2. Click "Add Credential"
3. Select provider (OpenAI, Claude, or Gemini)
4. Enter your API key
5. Save

## 📖 Usage

### Creating an Agent

1. Go to **Agents** page
2. Click **"New Agent"**
3. Fill in:
   - Name (e.g., "Socrates")
   - Provider (OpenAI, Claude, Gemini)
   - Model (e.g., "gpt-4-turbo")
   - System Message (agent personality)
   - Enable Web Search (optional)
4. Save

### Starting a Session

1. Go to **Sessions** page
2. Click **"New Session"**
3. Enter topic and select agents
4. Set max turns limit
5. Start conversation
6. Inject prompts to guide the discussion

### Viewing Reports

1. Open any completed session
2. Click **"Report"** button
3. View:
   - AI-generated summary
   - Participation charts
   - Detailed analytics
4. Download complete report with **"Download Complete Report"**

## 🎯 Key Features Explained

### Autonomous Conversations
Agents don't just respond once - they continue discussing until:
- An agent signals conclusion with `[CONVERSATION_CONCLUDED]`
- 3 full rounds of conversation complete
- Max turns limit is reached

### Web Search Access
Enable web search for agents to:
- Access real-time information
- Fact-check during conversations
- Provide up-to-date responses

### Encrypted Credentials
All API keys are:
- Encrypted with AES-256
- Stored securely in database
- Decrypted only when needed
- Never exposed in logs

## 📁 Project Structure

```
AgentVerse/
├── backend/
│   ├── agents/          # Agent management
│   ├── chat_sessions/   # Session & conversation logic
│   ├── users/           # Authentication
│   ├── vault/           # Credential management
│   └── agentverse/      # Django settings
├── frontend/
│   ├── app/
│   │   ├── dashboard/   # Main dashboard
│   │   ├── auth/        # Login/Register
│   │   └── components/  # Reusable components
│   ├── lib/             # Utilities
│   └── public/          # Static assets
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ using Django and Next.js
- Inspired by multi-agent AI research
- Neobrutalist design aesthetic

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**AgentVerse** - Orchestrate chaos with AI agents 🤖✨
