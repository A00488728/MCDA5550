import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getSavedCities, deleteCity } from '../util/database'; // Import database functions
import { useIsFocused } from '@react-navigation/native'; // Hook to check if the screen is focused
import { Button, Card, Paragraph } from 'react-native-paper'; // Import paper components
import { Ionicons } from 'react-native-vector-icons'; // Icon library

const SavedLocationsScreen = () => {
  const [savedCities, setSavedCities] = useState([]); // State to store the saved cities
  const isFocused = useIsFocused(); // Check if the screen is focused

  // Fetch saved cities when the screen is loaded or when the screen is focused
  useEffect(() => {
    loadSavedCities(); // Load saved cities from the database
  }, [isFocused]); // Trigger when the screen is focused or after a deletion

  // Load saved cities from the database
  const loadSavedCities = async () => {
    try {
      const cities = await getSavedCities(); // Fetch saved cities from the database
      setSavedCities(cities); // Update state with the list of cities
    } catch (error) {
      console.error('Error loading saved cities:', error);
    }
  };

  // Delete city from saved cities
  const removeCity = async (id) => {
    try {
      await deleteCity(id); // Delete the city from the database
      loadSavedCities(); // Refresh the list of saved cities after deletion
    } catch (error) {
      console.error('Error removing city:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Cities</Text>
      </View>

      {savedCities.length === 0 ? (
        <Text style={styles.noCitiesText}>No cities saved yet.</Text>
      ) : (
        savedCities.map((city) => (
          <Card key={city.id} style={styles.cityCard}>
            <Card.Content>
              <Text style={styles.cityName}>{city.name}</Text>
              <Paragraph style={styles.weatherDetails}>Temp: {city.temperature}°C</Paragraph>
              <Paragraph style={styles.weatherDetails}>Condition: {city.description}</Paragraph>
              <Paragraph style={styles.weatherDetails}>Humidity: {city.humidity}%</Paragraph>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeCity(city.id)}>
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f1f1f1',  // Lighter background for better contrast
  },
  header: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#6200ee', // Solid color for the header
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Roboto',
  },
  noCitiesText: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Roboto',
  },
  cityCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    marginVertical: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  weatherDetails: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
    fontFamily: 'Roboto',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'Roboto',
  },
});

export default SavedLocationsScreen;
