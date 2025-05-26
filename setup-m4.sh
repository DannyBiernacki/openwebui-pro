#!/bin/bash

# OpenWebUI Pro Setup Script for M4 Pro
# Optimized for MacBook Pro M4 Pro (14 cores, 48GB RAM)

echo "🚀 Starting OpenWebUI Pro setup for M4 Pro..."

# Check if running on M4 Pro
if [[ $(uname -m) != "arm64" ]]; then
    echo "❌ This script is optimized for Apple Silicon (M4 Pro)"
    exit 1
fi

# Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install required packages
echo "📦 Installing required packages..."
brew install node@20 pnpm postgresql@15 docker ollama

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
brew services start postgresql@15

# Create PostgreSQL database
echo "🗄️ Creating database..."
createdb openwebui_pro

# Install pnpm if not installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
pnpm install

# Configure environment variables
echo "⚙️ Configuring environment variables..."
cat > .env << EOL
# M4 Pro Optimized Environment Variables
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://localhost:5432/openwebui_pro"

# AI Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2:70b
OPENAI_API_KEY=

# Performance Settings
NODE_OPTIONS="--max-old-space-size=12288" # 12GB for Node.js
VITE_MAX_WORKERS=10 # Utilize 10 performance cores
EOL

# Configure Docker for M4 Pro
echo "🐳 Configuring Docker for M4 Pro..."
docker buildx create --use --name m4-builder
docker buildx inspect --bootstrap

# Start Ollama
echo "🤖 Starting Ollama..."
ollama serve &

# Wait for Ollama to start
sleep 5

# Pull the 70B model
echo "📥 Pulling 70B model..."
ollama pull llama2:70b

# Build the project
echo "🏗️ Building the project..."
pnpm build

# Start the development server
echo "🚀 Starting development server..."
pnpm dev

echo "✨ Setup complete! OpenWebUI Pro is ready to use."
echo "📝 Don't forget to:"
echo "  1. Configure your OpenAI API key in .env if needed"
echo "  2. Run 'pnpm test' to verify the setup"
echo "  3. Check the documentation at docs/README.md" 