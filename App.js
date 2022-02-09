import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Dimensions, View, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');  // screen size

const API_KEY = "46e689c910a78ca878d6a6a62f0604d0";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [region, setRegion] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city)
    setRegion(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts}&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
        {/* <Text style={styles.regionName}>{region}</Text> */}
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ?
          (<View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>) :
          (days.map((day, index) =>
            <View key={index} style={styles.day}>
              <Text style={styles.date}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={30} color="white" />
              {/* <Text style={styles.description}>{day.weather[0].main}</Text> */}
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: "salmon"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  regionName: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: "200",
    color: "white",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  date: {
    marginBottom: -50,
    fontSize: 25,
    color: "white",
  },
  temp: {
    marginTop: 50,
    fontSize: 140,
    color: "white",
  },
  description: {
    marginTop: -20,
    fontSize: 40,
    color: "white",
  },
  tinyText: {
    fontSize: 25,
    color: "white",
  }
})
