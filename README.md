<<<<<<< HEAD
# Twitter AI Reply Assistant - Enhanced Edition

A powerful Chrome extension that provides AI-powered content optimization for Twitter/X posts with 7 specialized commands for professional content creation.

## 🚀 Features

### 7 Content Optimization Commands

| Button | Command | Description |
|--------|---------|-------------|
| 👍 | **R3 Format** | Casual, lowercase, supportive Web3/crypto community style |
| 💪 | **Skimmable** | Rewrite for busy scrollers - make it easily scannable |
| 👎 | **Headlines** | Create 1 headline that builds curiosity and urgency |
| 💡 | **Lists** | Break into bold, punchy lists - structure sells |
| ❓ | **Edit** | Highlight strongest line, cut weakest - sniper editing |
| 🗣️ | **R3 Tone** | R3 format - casual, lowercase, supportive Web3/crypto style |
| 📝 | **Teaching** | Turn into teaching content - strategy over spam |

### 🎯 Key Formatting Rules

All AI responses follow strict formatting guidelines:
- ❌ No hyphens (-)
- ❌ No apostrophes ('s) 
- ❌ No hashtags (#)
- ❌ No links
- ❌ No emojis (except in R3 format where avoided)
- ❌ No clickbait
- ✅ Clean, professional formatting

### 🌐 R3 Comment Format

Special casual format for Web3/crypto communities:
- Short (1-2 sentences)
- All lowercase style
- Uses abbreviations: u, ur, fr, tbh, btw, rn, gonna
- Positive and supportive
- Sometimes includes: bro, mate, sir
- Opens discussions naturally

**Example:** `that's a cool vision, union sounds like a great way to make it happen. fr, interop is key rn.`

## 🔧 Multi-API Support

Supports multiple AI providers:
- **Google Gemini** (gemini-1.5-flash-8b)
- **OpenAI** (GPT-4o-mini, GPT-4, GPT-3.5)
- **Azure OpenAI** (with custom deployments)
- **Free APIs** (DeepSeek, Groq, Together AI)

## 📦 Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. Click the extension icon and configure your API key

## ⚙️ Configuration

1. Click the extension icon in Chrome
2. Select your preferred AI provider
3. Enter your API key
4. Test the connection
5. Start using the commands on Twitter/X

## 🎮 Usage

### On Twitter Feed:
- AI buttons appear next to tweet actions (like, retweet, reply)
- Click any command button to generate optimized responses
- Content is automatically copied to clipboard

### On Compose Pages:
- Floating buttons appear when composing tweets
- Select the type of content optimization you want
- AI generates content according to the selected style

## 🛠️ Technical Details

### Files Structure:
- `manifest.json` - Extension configuration
- `background.js` - AI API integration and prompt logic
- `content.js` - Twitter page interaction and UI injection
- `popup.js` - Extension settings popup
- `popup.html` - Settings interface
- `styles.css` - Extension styling

### Supported Platforms:
- Twitter.com
- X.com
- All compose and reply interfaces

## 🔒 Privacy & Security

- API keys stored locally in Chrome storage
- No data sent to external servers except AI providers
- All processing happens client-side
- Respects Twitter's terms of service

## 📈 Updates in This Version

### New Features:
- 7 specialized content optimization commands
- R3 format for Web3/crypto community engagement
- Multi-API provider support
- Enhanced content formatting rules
- Improved UI with descriptive tooltips

### Bug Fixes:
- Better Twitter page detection
- Improved button placement
- Enhanced error handling
- More reliable content injection

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the extension.

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [Chrome Web Store](#) (if published)
- [Issues & Support](#)
- [Feature Requests](#)

---

**Made for the Web3/crypto community and content creators who value quality over quantity.** 
=======
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
>>>>>>> be8621848e5e268a689a06f9820b568e5541bca3
