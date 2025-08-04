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