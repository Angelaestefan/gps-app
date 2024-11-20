import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Add this interface before the App component
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function App() {
  const [location, setLocation] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getLocation();
        if (loc) {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la ubicación');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={location}
          showsUserLocation
          showsTraffic={true} // Opción para mostrar tráfico
        >
          {/* Ejemplo de un marcador */}
          <Marker
            coordinate={location}
            title="Estás aquí"
            description="Esta es tu ubicación actual"
          />
        </MapView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
    return null;
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return location;
}
