# Twitter AI Reply Assistant v3.0

A powerful Chrome extension that adds AI-powered reply generation to Twitter/X using either Google Gemini or OpenAI APIs.

## ✨ Features

- **Multi-API Support**: Choose between Google Gemini (Free), OpenAI GPT (Paid), or OpenAI Free (No API Key)
- **Smart Reply Generation**: 5 different response types (👍 Like, 💪 Support, 👎 Dislike, 💡 Suggestion, ❓ Question)
- **Floating UI**: Modern glassmorphism design with always-visible floating bubble
- **Image Support**: Analyze tweets with images for contextual responses (Gemini & OpenAI)
- **Auto-Reply**: Automatically enables reply/post buttons after generation
- **Clipboard Copy**: Primary method with auto-fill as backup
- **Mobile Responsive**: Works on different screen sizes

## 🔧 Setup

### Option 1: Google Gemini (Free)
1. Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the extension popup
3. Select "Google Gemini (Free)" as your provider
4. Enter your Gemini API key
5. Click "Test Connection" to verify

### Option 2: OpenAI (Paid)
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open the extension popup
3. Select "OpenAI GPT (Paid)" as your provider
4. Enter your OpenAI API key
5. Choose your preferred model (GPT-4o Mini recommended)
6. Click "Test Connection" to verify

### Option 3: OpenAI Free (No API Key)
1. Open the extension popup
2. Select "OpenAI ChatGPT (Free)" as your provider
3. Choose your preferred platform (DeepSeek recommended)
4. Click "Test Connection" to verify
5. No API key required - works immediately!

## 📱 Usage

1. **Feed Pages**: Visit Twitter/X timeline
2. **Compose Pages**: Go to compose/reply pages
3. **Look for Floating Bubble**: Find the emoji buttons (👍💪👎💡❓) in the top-right area
4. **Click Any Button**: Generate contextual AI responses
5. **Content is Copied**: Response is automatically copied to clipboard
6. **Paste & Send**: Paste the response and send your tweet/reply

## 🌟 Response Types

- **👍 Like It**: Show agreement and support
- **💪 Support It**: Provide strong support and motivation
- **👎 Dislike It**: Polite and constructive disagreement
- **💡 Suggestion**: Constructive suggestions and advice
- **❓ Question**: Engaging questions to spark discussion

## 🎨 UI Design

- **Floating Bubble**: Glassmorphism design with blur effects
- **Always Visible**: Positioned at top-right, never hidden
- **Responsive**: Adapts to different screen sizes
- **Modern**: Clean, translucent design with hover animations

## 🔒 Privacy

- All API calls are made directly to Google/OpenAI/Free API servers
- No data is stored on external servers
- API keys are stored locally in Chrome's sync storage
- Extension only works on Twitter/X domains

## 🛠️ Technical Details

- **Manifest V3**: Uses latest Chrome extension architecture
- **Multi-API Architecture**: Unified interface for different AI providers
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Image Processing**: Base64 conversion for Gemini, URL passing for OpenAI
- **Legacy Support**: Maintains backwards compatibility with old API structure

## 📋 Installation

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension folder
6. Configure your preferred AI provider in the popup

## 🔄 Changelog

### v3.0 (Latest)
- Added OpenAI GPT support with model selection
- Added OpenAI Free support (No API Key required)
- Multi-API provider selection interface (3 providers)
- Enhanced configuration management
- Updated UI with provider-specific styling
- Improved error handling for all APIs

### v2.0
- BlitzX-style floating bubble UI
- 5 response type buttons
- Glassmorphism design
- Auto-reply functionality
- Clipboard copy primary method

### v1.0
- Basic Gemini API integration
- Simple reply generation
- Basic UI implementation

## 🤝 Support

If you encounter any issues:
1. Check your API key is valid and has sufficient quota
2. Verify your internet connection
3. Try refreshing the Twitter/X page
4. Test your API connection in the extension popup

## 💝 Credits

Made with ❤️ Kuro

Supports Google Gemini, OpenAI, and Hugging Face APIs for maximum flexibility and choice.

### **Performance**

- **Gemini**: Fast, free, perfect for daily use
- **OpenAI GPT-4o Mini**: Balanced quality and cost
- **OpenAI GPT-4o**: Best quality for complex use cases
- **OpenAI Free**: Completely free, no signup required, may have rate limits 