import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Platform } from 'react-native'; 
import { init, insertData } from './util/database'; // Import the functions from the updated database.js
import AppLoading from 'expo-app-loading';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isInserted, setIsInserted] = useState(false); // To track if the data was inserted successfully

  // Initialize the database on first load if the app is running on mobile devices
  useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const initializeDb = async () => {
        try {
          await init(); // Initialize the database
          setDbInitialized(true); // Set state to true once initialization is successful
        } catch (err) {
          console.error('Error initializing database:', err); // Handle error if initialization fails
        }
      };

      initializeDb(); // Call the async function to initialize the DB
    } else {
      setDbInitialized(true); // Skip database initialization for non-mobile platforms
    }
  }, []); // Empty array ensures this runs only once when the app loads

  // Handle inserting data into the database
  const handleInsertData = async () => {
    if (inputText.trim()) {
      try {
        const result = await insertData(inputText); // Wait for data to be inserted
        console.log('Data inserted successfully:', result);
        setIsInserted(true); // Set to true once the data is inserted
        setInputText(''); // Clear the input field after successful insert
      } catch (error) {
        console.error('Failed to insert data:', error); // Handle insertion error
      }
    }
  };

  // Show a loading screen until the DB is initialized
  if (!dbInitialized) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Input Box</Text>

      <TextInput
        style={styles.input}
        placeholder="Type something..."
        onChangeText={setInputText}
        value={inputText}
      />

      <Button title="Insert Data" onPress={handleInsertData} />

      {isInserted && (
        <Text style={styles.successMessage}>Data inserted successfully!</Text>
      )}

      <Text style={styles.displayText}>You typed: {inputText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 18,
    color: '#333',
  },
  successMessage: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
});
