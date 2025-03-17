import * as SQLite from 'expo-sqlite';

let database1; // Declare the database variable

// Initialize the database and create the table if it doesn't exist
export async function init1() {
  try {
    // Open the database asynchronously
    database1 = await SQLite.openDatabaseAsync('text.db');

    // Create the table if it doesn't exist
    await database1.execAsync(`
      CREATE TABLE IF NOT EXISTS text (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      )
    `);
    console.log('Table created or already exists.');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
}

// Insert data into the 'text' table
export async function insertData(title) {
  try {
    const result = await database1.runAsync(
      'INSERT INTO text (title) VALUES (?)', 
      [title]
    );
    console.log('Inserted row:', result);
    return result; // Return the result of the insertion
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error; // Propagate the error for handling in the caller
  }
}

// Retrieve all data from the 'text' table
export async function getAllData() {
  try {
    const result = await database1.getAllAsync('SELECT * FROM text');
    console.log('Retrieved all data:', result);
    return result; // Return the data
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error; // Propagate the error for handling in the caller
  }
}

// Insert data using the old insertText function (you can remove this if it's unnecessary)
export async function insertText(title) {
  try {
    const result = await insertData(title); // Reusing the insertData function
    return result;
  } catch (error) {
    console.error('Error inserting text:', error);
    throw error;
  }
}


let database; // Declare the database variable

// Initialize the database and create the table if it doesn't exist
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
    console.log('Table created or already exists.');
  } catch (error) {
    console.error('Error initializing the database:', error);
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
