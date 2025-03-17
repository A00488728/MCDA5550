// App.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import CurrentLocationWeatherScreen from './screens/CurrentLocationWeatherScreen'; // Import CurrentWeatherScreen
import SearchWeatherScreen from './screens/SearchWeatherScreen'; // Import ForecastScreen
import SavedLocationsScreen from './screens/SavedLocationsScreen'; // Import SavedLocationsScreen

const Tab = createBottomTabNavigator();

// Define the tab navigation
const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Current Weather" component={CurrentLocationWeatherScreen} />
        <Tab.Screen name="Search City Weather" component={SearchWeatherScreen} />
        <Tab.Screen name="Saved Locations" component={SavedLocationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
