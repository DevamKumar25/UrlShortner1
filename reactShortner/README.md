# 🔗 URL Shortener - React App

A modern, client-side URL shortener built with **React**, **Material UI**, and **React Router**. Features analytics, custom shortcodes, and expiry controls.

## 🚀 Features

- ✨ Shorten multiple URLs (up to 5 at once)
- ⏳ Set custom expiry (default: 30 minutes)
- 🔑 Custom shortcode support
- 📊 Click analytics with geolocation
- 📋 Copy short URLs with one click
- 🛡️ Client-side validation
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **UI**: Material UI (v7)
- **Routing**: React Router v7
- **Logging**: Custom middleware
- **Utility**: date-fns, uuid

## 🖥️ Live Demo

👉 [Try it on Vercel](https://your-deployed-app.vercel.app) *(Add your deployment link)*

## 📦 Installation

1. Clone the repo:
   git clone https://github.com/DevamKumar25/urlShortner.git


2. Install dependencies:
   npm install

3.Run the development server:
  npm run dev


## 🎨 Customization
  Edit vite.config.js to change port:

  server: {
  port: 3000, // Change to your preferred port
}

## 🌟 Highlights
  // Sample code snippet - URL validation
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

📄 License
MIT

Made with ❤️ by Devam Kumar

 
   
   
