# AgendaCultural - Event Management Platform

AgendaCultural is a modern web application built with Astro that helps users discover and manage cultural events. The platform integrates with Google Sheets to provide real-time event updates and information.

## Features

- 📅 Real-time event updates from Google Sheets
- 🖼️ Event flyers and images support
- 📍 Location and time details for each event
- 🔍 Search and filter events by type
- 🌙 Dark/Light theme support
- 📱 Responsive design for all devices

## Tech Stack

- [Astro](https://astro.build) - Modern static site generator
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Google Sheets API](https://developers.google.com/sheets/api) - Real-time data integration
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Google Sheets API credentials

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/[your-username]/AgendaCultural.git
   cd AgendaCultural
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with your Google Sheets API credentials:
   ```env
   GOOGLE_SHEETS_API_KEY=your_api_key
   GOOGLE_SHEETS_ID=your_sheet_id
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:4321`

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── content/         # Content collections
│   ├── layouts/         # Page layouts
│   ├── pages/           # Application pages
│   └── utils/           # Utility functions
├── astro.config.mjs     # Astro configuration
├── tailwind.config.mjs  # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Available Scripts

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run format`       | Format code with Prettier                        |
| `npm run lint`         | Lint code with ESLint                            |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Project Maintainer: [Your Name]  
Email: your.email@example.com  
GitHub: [@yourusername](https://github.com/yourusername)
