# Smart Light - Home Automation UI

A modern, interactive web application for controlling smart lights in a home environment. This project simulates a smart home lighting system, allowing users to toggle lights, adjust brightness, automate schedules, and manage Wi-Fi connectivity—all from a beautiful, responsive interface.

## Features

- **Room-based Light Control:**
  - Toggle lights on/off for individual rooms (Hall, Bedroom, Bathroom, Kitchen, Guest Room, Outdoor Lights, Walkway & Corridor).
  - Adjust light intensity in real-time using sliders.
  - Visual feedback with light bulb icons and background brightness.

- **General Controls:**
  - Master switch to turn all lights on or off at once.
  - Wi-Fi toggle to simulate connectivity; all controls depend on Wi-Fi status.

- **Advanced Settings:**
  - Set automatic on/off times for each room.
  - Modal interface for advanced scheduling and customization.
  - Usage analytics chart (Chart.js integration ready).

- **Wi-Fi Management:**
  - Simulated Wi-Fi network list with signal strength and protection status.
  - Notification system for Wi-Fi and light actions.

- **Responsive UI:**
  - Works on desktop and mobile screens.
  - Smooth transitions and modern design.

## Demo

![Smart Light UI Screenshot](./assets/imgs/demo_screenshot.png)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [yarn]

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/smart-light.git
   cd smart-light
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the project:**
   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Start a local server:**
   You can use any static server. For example:
   ```bash
   npx serve .
   # or
   npm install -g live-server
   live-server
   ```
   Then open [http://localhost:8080](http://localhost:8080) in your browser.

## Usage

- Click **"Click to begin"** to enter the main dashboard.
- Use the sliders to adjust light intensity for each room.
- Click the light bulb icon to toggle lights on/off.
- Use the Wi-Fi toggle in the navigation bar to simulate connectivity.
- Click the enlarge icon for advanced settings (automation, analytics).
- View and select Wi-Fi networks from the Wi-Fi notification area.

## Project Structure

```
smart-light/
├── assets/           # SVGs and images
├── dist/             # Compiled JavaScript files
├── src/              # TypeScript source files
│   ├── main.ts       # Main entry point
│   ├── basicSettings.ts
│   ├── advanceSettings.ts
│   ├── general.ts
│   └── types.ts
├── style.css         # Main stylesheet
├── index.html        # Main HTML file
├── jest.config.js    # Jest test configuration
├── Bugs.md           # Bug documentation and fixes
└── ...
```

## Testing

- Unit tests are written using [Jest](https://jestjs.io/) and [jsdom](https://github.com/jsdom/jsdom).
- To run tests:
  ```bash
  npm test
  # or
  yarn test
  ```

## Customization

- **Add new rooms:**
  - Update `componentsData` in `src/general.ts` and add corresponding HTML in `index.html`.
- **Change default automation times:**
  - Edit the `autoOn` and `autoOff` fields in `componentsData`.
- **Update Wi-Fi networks:**
  - Modify the `wifiNetworks` array in `src/main.ts`.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Chart.js](https://www.chartjs.org/) for analytics (optional integration)
- [SVG Repo](https://www.svgrepo.com/) for icon assets
- Inspired by modern smart home UI/UX patterns 