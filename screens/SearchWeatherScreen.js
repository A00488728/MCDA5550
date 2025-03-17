import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import { Button, Card, Snackbar } from 'react-native-paper';
import { Ionicons } from 'react-native-vector-icons';
import { init, saveCity, getSavedCities } from '../util/database'; // Import database functions
import { useIsFocused } from '@react-navigation/native'; // Hook to track when the screen is focused

const SearchWeatherScreen = () => {
  const [city, setCity] = useState('');  // City input by the user
  const [weatherData, setWeatherData] = useState(null);  // Weather data for the searched city
  const [loading, setLoading] = useState(false);  // Loading state for weather data
  const [savedCities, setSavedCities] = useState([]);  // List of saved cities
  const [error, setError] = useState(null);  // Error message for failed weather fetch
  const [snackbarVisible, setSnackbarVisible] = useState(false);  // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message to display
  const [canSave, setCanSave] = useState(true);  // Whether the user can save more cities
  const isFocused = useIsFocused();  // Hook to track screen focus

  // Initialize the database and load saved cities when the component mounts or when screen is focused
  useEffect(() => {
    const initializeDatabase = async () => {
      await init(); // Initialize the database and create the table
      loadSavedCities(); // Load saved cities from the database
    };

    if (isFocused) {
      loadSavedCities(); // Refresh saved cities when the screen is focused
    }

    initializeDatabase(); // Initialize when the screen is loaded
  }, [isFocused]);

  // Fetch saved cities from the database
  const loadSavedCities = async () => {
    try {
      const cities = await getSavedCities(); // Fetch saved cities from the database
      setSavedCities(cities);  // Update saved cities state
      setCanSave(cities.length < 4);  // Allow saving only if there are less than 4 saved cities
    } catch (error) {
      console.error('Error loading saved cities:', error);
    }
  };

  const getWeather = async () => {
    const trimmedCity = city.trim();

    if (trimmedCity === '') {
      setError('Please enter a valid city name.');
      setSnackbarMessage('City name cannot be empty.');
      setSnackbarVisible(true);
      return;
    }

    const API_KEY = 'ace38e205ecc9173b9dbf66d85d440a4';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${API_KEY}&units=metric`;

    setLoading(true);

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setWeatherData(response.data);  // Set the fetched weather data
        setError(null);  // Clear any previous errors
      } else {
        throw new Error('Invalid city');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      setSnackbarMessage('City not found, please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async () => {
    if (!canSave) {
      setSnackbarMessage('You can only save up to 4 cities');
      setSnackbarVisible(true);
      return;
    }

    if (weatherData && !savedCities.some((city) => city.name === weatherData.name)) {
      if (weatherData.name && weatherData.main) {
        await saveCity(weatherData); // Save the city data to the database
        loadSavedCities();  // Refresh the saved cities after saving
      } else {
        setSnackbarMessage('City weather data is not valid.');
        setSnackbarVisible(true);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search & Display Weather</Text>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#6200ee" style={styles.inputIcon} />
        <TextInput
          label="Enter City"
          value={city}
          onChangeText={setCity}
          style={styles.input}
          mode="outlined"
          placeholder="e.g. New York"
          placeholderTextColor="#aaa"
        />
      </View>

      <Button
        mode="contained"
        onPress={getWeather}
        style={styles.searchButton}
        loading={loading}
        disabled={loading}>
        Search Weather
      </Button>

      {loading && <ActivityIndicator size="large" color="#6200ee" />}

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
        onPress={saveLocation}
        disabled={!canSave || savedCities.length >= 4}
        style={styles.saveButton}>
        Save Location
      </Button>

      <Text style={styles.savedLocationsTitle}>Saved Locations:</Text>
      <View style={styles.savedLocations}>
        {savedCities.map((city, index) => (
          <Text key={index} style={styles.savedCity}>
            {city.name}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 350,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden', // This ensures the input box doesn't overflow
  },
  input: {
    width: '100%',
    height: 50,
    marginLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  inputIcon: {
    marginRight: 10,
  },
  searchButton: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 30,
    backgroundColor: '#6200ee',
    borderRadius: 10,
  },
  weatherCard: {
    marginTop: 20,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 8,
  },
  weatherText: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
    fontFamily: 'Roboto',
  },
  saveButton: {
    marginTop: 25,
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#6200ee',
    borderRadius: 10,
  },
  savedLocationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 35,
    color: '#333',
    fontFamily: 'Roboto',
  },
  savedLocations: {
    marginTop: 15,
    padding: 15,
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  savedCity: {
    fontSize: 18,
    marginVertical: 5,
    color: '#6200ee',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});

export default SearchWeatherScreen;
