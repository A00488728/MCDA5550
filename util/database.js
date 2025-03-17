import * as SQLite from 'expo-sqlite';

let database; // Declare the database variable for weather data

// Initialize the database and create the table if it doesn't exist for weather data
export async function init() {
  try {
    // Open the database asynchronously
    database = await SQLite.openDatabaseAsync('weather.db');

    // Create the table if it doesn't exist
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_cities (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        temperature REAL NOT NULL,
        description TEXT NOT NULL,
        humidity REAL NOT NULL
      )
    `);
    console.log('Table created or already exists for saved cities.');
  } catch (error) {
    console.error('Error initializing the database for weather data:', error);
    throw error;
  }
}

// Insert weather data into the 'saved_cities' table
export async function saveCity(cityData) {
  try {
    const { name, main, weather } = cityData;
    const temperature = main.temp;
    const description = weather[0].description;
    const humidity = main.humidity;

    const result = await database.runAsync(
      'INSERT INTO saved_cities (name, temperature, description, humidity) VALUES (?, ?, ?, ?)',
      [name, temperature, description, humidity]
    );
    console.log('Inserted city:', result);
    return result; // Return the result of the insertion
  } catch (error) {
    console.error('Error saving city:', error);
    throw error; // Propagate the error for handling in the caller
  }
}

// Retrieve all saved cities from the 'saved_cities' table
export async function getSavedCities() {
  try {
    const result = await database.getAllAsync('SELECT * FROM saved_cities');
    console.log('Retrieved saved cities:', result);
    return result; // Return the data
  } catch (error) {
    console.error('Error retrieving saved cities:', error);
    throw error; // Propagate the error for handling in the caller
  }
}

// Delete a city from the 'saved_cities' table by its id
export async function deleteCity(id) {
  try {
    const result = await database.runAsync(
      'DELETE FROM saved_cities WHERE id = ?',
      [id]
    );
    console.log('Deleted city:', result);
    return result; // Return the result of the deletion
  } catch (error) {
    console.error('Error deleting city:', error);
    throw error; // Propagate the error for handling in the caller
  }
}
