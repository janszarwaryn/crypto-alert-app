# Crypto Alerts Dashboard

Real-time Bitcoin trading monitor with advanced alerts system for Binance trades.

## Requirements

- Node.js v18+
- npm v9+
- CryptoCompare API key (with r_price_poll_basic and r_price_stream_basic rights)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add API key to `.env`:
```
REACT_APP_CRYPTO_API_KEY=your_api_key_here
```

## Usage

```bash
# Development
npm start

# Tests
npm test

# Production build
npm run build
```

## Core Features

### 1. Monitor Page
- Real-time BTC/USDT trade monitoring from Binance
- Terminal-style display with monospaced font
- Latest 500 orders with newest at top
- Human-readable data formatting
- Highlighted alerts based on configurable thresholds
- Persistent data display after stream stop

### 2. Alerts Page
- Wall monitor-ready display for trading centers
- Three alert categories with configurable thresholds:
  - "Cheap order" (default: < $50,000)
  - "Solid order" (default: > 10 BTC)
  - "Big biznis here" (default: > $1M total value)
- Real-time alert counters
- Detailed alert lists with price, quantity, and total value
- 60-second alert history retention
- All alerts visible (not limited to 500 orders display)

> ⚠️ **IMPORTANT NOTE**: The default alert thresholds might not trigger alerts frequently enough in current market conditions. It is strongly recommended to adjust these values in the Settings dialog to match your monitoring needs. For example, you might want to lower the "Cheap order" threshold or decrease the "Solid order" BTC amount.

### 3. Advanced Features

#### WebSocket Connection Management
- Real-time connection status indicator
- Automatic reconnection handling
- Connection state messages:
  - Initializing
  - Connecting
  - Live
  - Disconnected
  - Reconnecting
- Smart reconnection delays for stability

#### Alert System Enhancements
- Configurable alert thresholds via settings dialog
- Visual feedback during settings changes
- Stabilization period after threshold updates
- Real-time threshold validation
- Persistent settings storage

#### Performance Optimizations
- Virtual scrolling for order list
- Efficient order caching system
- Smart data structure management
- Memory usage optimization
- Automatic cleanup for expired alerts

#### User Interface
- Material-UI components for modern look
- Responsive design for all screen sizes
- Dark mode theme
- Clear status indicators
- Intuitive navigation
- Settings configuration dialog

#### Error Handling
- Comprehensive WebSocket error management
- Data validation and sanitization
- User-friendly error messages
- Automatic error recovery
- Network status monitoring

## Project Structure

The project follows best practices for React/TypeScript applications:
- Context-based state management
- Custom hooks for business logic
- Component-based architecture
- Type safety with TypeScript
- Efficient real-time data handling

## Testing

- Unit tests for alert rules
- WebSocket connection tests
- Component rendering tests
- State management tests
- Alert system integration tests
