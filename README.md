e# Crypto Alerts

Real-time Bitcoin trading monitor with alerts system.

## Requirements

- Node.js v18+
- npm v9+
- CryptoCompare API key

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

## Features

### Required Features
1. **Real-time Monitoring**
   - Live BTC/USDT trades from Binance
   - WebSocket connection
   - Start/Stop control

2. **Alert System**
   - Cheap Orders (< $50,000)
   - Solid Orders (> 10 BTC)
   - Big Business (> $1M)
   - 60-second alert history
   - Settings options to change filterts to [50,000, 10 BTC, $1M]

### Additional Features
1. **Alert Enhancements**
   - Visual indicators for each alert type
   - Alert messages with detailed information
   - Automatic alert cleanup after 60 seconds
   - Price formatting in BTC and USD

2. **Testing**
   - Unit tests for alert rules
   - Integration tests for WebSocket
   - Alert generation tests

3. **Performance**
   - Message buffering
   - 500 orders limit
   - Efficient state updates

4. **Error Handling**
   - Auto-reconnection for WebSocket
   - Data validation
   - Connection status monitoring

5. **UI**
   - Material-UI components
   - Dark mode theme
   - Responsive layout
   - Loading states with status info
