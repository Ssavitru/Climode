# Clima - Weather Clothing Recommendation App

<div align="center">
  <img src="public/logo.png" alt="Clima Logo" width="120"/>
  
  <p>Your personal weather-based clothing advisor</p>

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://whatowear.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

</div>

## 🌟 Features

- 🌍 **Location-Based Weather**: Real-time weather data for any location worldwide
- 👕 **Smart Recommendations**: AI-powered clothing suggestions based on weather conditions
- 🌡️ **Temperature Preferences**: Personalize recommendations based on your temperature sensitivity
- 🎨 **Dynamic UI**: Beautiful, responsive interface with city-specific backgrounds
- 🌐 **Multilingual**: Supports English, French, Spanish, German, Italian, and Arabic
- 📱 **PWA Support**: Install and use offline on any device

![image](https://github.com/user-attachments/assets/179d4efe-c400-47cf-a3cc-192633e6f742)



## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenWeather API key
- Pexels API key (for city images)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/DressSmart.git
cd DressSmart
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file with:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
PEXELS_API_KEY=your_pexels_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks + Context
- **APIs**:
  - OpenWeather (weather data)
  - Pexels (city images)
- **PWA Features**: Workbox + Next PWA

## 🌈 Features in Detail

### Weather Data

- Real-time weather conditions
- 5-day forecast
- Temperature, humidity, wind speed, UV index
- Location-based suggestions

### Clothing Recommendations

- Temperature-appropriate clothing suggestions
- Layering recommendations
- Accessory suggestions (umbrella, sunglasses, etc.)
- Customizable based on personal temperature preferences

### User Experience

- Intuitive interface
- Smooth animations
- Offline support
- Cross-device synchronization
- Dark mode support

## 🌍 Internationalization

Currently supports:

- 🇺🇸 English
- 🇫🇷 French
- 🇪🇸 Spanish
- 🇩🇪 German
- 🇮🇹 Italian
- 🇸🇦 Arabic

## 📱 PWA Features

- Offline functionality
- Install prompts
- Background sync
- Push notifications (coming soon)
- Responsive design

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- City images provided by [Pexels](https://www.pexels.com/)
- Icons by [Lucide](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
