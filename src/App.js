import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { CssBaseline } from '@mui/material';
import { useState } from 'react';
import { Alert } from '@mui/material';
import { useEffect } from 'react';
// Dark theme

function App() {
  const [requestUrl, setRequestUrl] = useState('');
  const [zuhrtime, setZuhrtime] = useState('');
  const [fajrttime, setFajrttime] = useState('');
  const [maghribtime, setMaghribtime] = useState('');
  const [ishaattime, setIshaattime] = useState('');
  const [asrttime, setAsrttime] = useState('');
  useEffect(() => {
    getMyLocation();
    document.title = 'Prayer Time Checker';
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  // api variables
  const api1 = 'https://api.aladhan.com/v1/timings/';
  const api2 = '?latitude=';
  const api3 = '&longitude=';
  // Get location
  const [showAlert, setShowAlert] = useState(false);
  const getMyLocation = () => {
    async function success (position) {
      //console.log(position);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      let timestamp = position.timestamp;
      console.log('api1 + timestamp')
      console.log(api1+timestamp);
      console.log(api1+timestamp+api2)
      console.log(api1+timestamp+api2+latitude);
      // cut down timestamp
      timestamp = timestamp.toString().substr(0, timestamp.toString().length - 3);
      setRequestUrl(api1 + timestamp + api2 + latitude + api3 + longitude);
      //console.log("Request URL:")
      console.log(api1 + timestamp + api2 + latitude + api3 + longitude);
      //console.log('Timestamp:')
      //console.log(timestamp);
      setShowAlert(true);
      const response = await fetch(api1 + timestamp + api2 + latitude + api3 + longitude);
      let adata = await response.json();
      console.log(adata)
      setZuhrtime(convert24hourTo12HourFormat(adata.data.timings.Dhuhr));
      setFajrttime(convert24hourTo12HourFormat(adata.data.timings.Fajr));
      setMaghribtime(convert24hourTo12HourFormat(adata.data.timings.Maghrib));
      setAsrttime(convert24hourTo12HourFormat(adata.data.timings.Asr));
      setIshaattime(convert24hourTo12HourFormat(adata.data.timings.Isha));
      
      console.log(zuhrtime);
      console.log(fajrttime);
      console.log(maghribtime);
      console.log(ishaattime);
      console.log(asrttime);
    }
    const error = () => {
      console.log('error');
      setShowAlert(false);
    }
    navigator.geolocation.getCurrentPosition(success, error);

    function convert24hourTo12HourFormat (time) {
      const time_part_array = time.split(":");
      let ampm = 'AM';
      if (time_part_array[0] >= 12) {
          ampm = 'PM';
      }
      if (time_part_array[0] > 12) {
          time_part_array[0] = time_part_array[0] - 12;
      }
      const formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;
      return formatted_time;
    }

  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <h2>{showAlert ? <Alert variant="filled" severity="success">Location Accessed</Alert> : <Alert variant="filled" severity="error">Unable to get location. Enable location to use this</Alert>}</h2>
      
      <h1>Fajr: {fajrttime}</h1>
      <h1>Dhuhr: {zuhrtime}</h1>
      <h1>Asr: {asrttime}</h1>
      <h1>Maghrib: {maghribtime}</h1>
      <h1>Isha: {ishaattime}</h1>
    </ThemeProvider>
  );
}

export default App;
