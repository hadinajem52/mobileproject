# Money Transfer Application

A React Native mobile application for secure and easy peer-to-peer money transfers.

## Features

- User authentication (login/signup)
- Send and receive money
- Transaction history
- Balance management
- Support and contact

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npx expo start`

## Usage

1. Launch the app
2. Sign up or log in
3. Navigate through the dashboard to send/receive money or view history
4. Use the support screen for help

### QR Scanning (camera-only)
The app includes a QR scanning flow for sending money quickly using your device camera. Screenshots or gallery images are NOT supported for scanning — you must scan a QR that is displayed on a physical or another device's screen.

To enable scanning, install the required Expo camera dependency (if missing):

```
npx expo install expo-camera
```

To use the flow:
- The sender opens `Receive Money` and shows their QR on screen.
- The receiver opens `Send Money`, taps `Scan QR`, scans the sender's QR using the camera, fills the amount, and taps `Send Money`.


## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage

## Project Structure

- `screens/`: All screen components
- `context/`: App context for state management
- `assets/`: Images and other assets