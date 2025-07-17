// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation/Navigation';
import { RegisterProvider } from './src/context/RegisterContext'; // wrap if using context

export default function App() {
  return (
    <RegisterProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </RegisterProvider>
  );
}
