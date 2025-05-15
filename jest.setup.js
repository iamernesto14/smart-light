// Set up jsdom globals
global.window = global;
global.document = global.window.document;

// Mock window.isWifiActive
Object.defineProperty(global.window, 'isWifiActive', {
  value: true,
  writable: true,
});