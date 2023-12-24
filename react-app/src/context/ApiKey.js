import React, { useEffect, useState } from "react";
import { useContext } from "react";
const GoogleMapsApiKeyContext = React.createContext();

function MapsProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);

  useEffect(() => {
    const apiKeyFunc = async () => {
      const res = await fetch("/api/auth/google/key");
      const data = await res.json();
      setApiKey(data.key);

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps API script has loaded");
        // Now, the google object should be available
      };
      document.head.append(script);
    };
    apiKeyFunc();
  }, []);

  return (
    <GoogleMapsApiKeyContext.Provider value={apiKey}>
      {children}
    </GoogleMapsApiKeyContext.Provider>
  );
}

export const useApiKey = () => useContext(GoogleMapsApiKeyContext);

export default MapsProvider;
