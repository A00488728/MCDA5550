import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Button, Card, Snackbar } from 'react-native-paper';

const CurrentLocationWeatherScreen = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync(); // Update permission request
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      getWeather(userLocation.coords.latitude, userLocation.coords.longitude);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError('Failed to get location');
      setSnackbarMessage('Failed to get location');
      setSnackbarVisible(true);
    }
  };

  const getWeather = async (lat, lon) => {
    const API_KEY = 'ace38e205ecc9173b9dbf66d85d440a4'; // Make sure this is a valid key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    setLoading(true);
    try {
      const response = await axios.get(url);
      console.log(response.data); // Log the response to see the data returned
      setWeatherData(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err); // Log the error from the API
      setError('Failed to fetch weather data');
      setSnackbarMessage('Failed to fetch weather data');
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <ImageBackground source={require('../assets/weather-background.jpg')} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Current Location Weather</Text>

        {loading && <ActivityIndicator size="large" color="#ffffff" />}

        {error && (
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            action={{
              label: 'Close',
              onPress: () => setSnackbarVisible(false),
            }}>
            {snackbarMessage}
          </Snackbar>
        )}

        {weatherData && !loading && !error && (
          <Card style={styles.weatherCard}>
            <Card.Content>
              <Text style={styles.weatherText}>Location: {weatherData.name}</Text>
              <Text style={styles.weatherText}>Temperature: {weatherData.main.temp}°C</Text>
              <Text style={styles.weatherText}>Condition: {weatherData.weather[0].description}</Text>
              <Text style={styles.weatherText}>Humidity: {weatherData.main.humidity}%</Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={() => getLocation()}
          style={styles.refreshButton}
          loading={loading}
          labelStyle={styles.buttonLabel}>
          Refresh Weather
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add overlay for better text visibility
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  weatherCard: {
    marginTop: 20,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 6, // For shadow effect
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
    fontWeight: '500',
  },
  refreshButton: {
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#6200ee',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CurrentLocationWeatherScreen;
