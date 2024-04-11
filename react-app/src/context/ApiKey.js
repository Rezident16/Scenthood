import React, { useEffect, useState } from "react";
const GoogleMapsApiKeyContext = React.createContext();

function MapsProvider({ children }) {
  const [apiKey, setApiKey] = useState(null);
  const [isGoogleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    const apiKeyFunc = async () => {
      try {
        const res = await fetch("/api/auth/google/key");
        const data = await res.json();
        setApiKey(data.key);

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.key}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.id = "google-map-script";
        script.onload = () => setGoogleScriptLoaded(true);
        script.onerror = () => {
          console.error("Failed to load Google Maps script, retrying...");
          setLoadAttempts(loadAttempts + 1);
        };
        document.head.append(script);
      } catch (error) {
        console.error("Failed to fetch the API key", error);
      }
    };
    if (loadAttempts < 5) {
      apiKeyFunc();
    } else {
      console.error("Failed to load Google Maps script after 3 attempts");
    }
  }, [apiKey, loadAttempts]);

  return (
    <GoogleMapsApiKeyContext.Provider value={{ apiKey, isGoogleScriptLoaded }}>
      {children}
    </GoogleMapsApiKeyContext.Provider>
  );
}

export const useApiKey = () => React.useContext(GoogleMapsApiKeyContext);

export default MapsProvider;
