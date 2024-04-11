import { useEffect } from "react";
import { useApiKey } from "../../context/ApiKey";

function SetUserAddress(setAddress, setCity, setState) {
  const {apiKey, isGoogleScriptLoaded} = useApiKey();
  let autocomplete;
  useEffect(() => {
    if (apiKey && isGoogleScriptLoaded && window.google) {
      autocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("searchTextField")
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const addressComponents = place.address_components;
        let city,
          state,
          address = "";
        for (let i = 0; i < addressComponents.length; i++) {
          if (addressComponents[i].types.includes("locality")) {
            city = addressComponents[i].long_name;
          }
          if (
            addressComponents[i].types.includes("administrative_area_level_1")
          ) {
            state = addressComponents[i].short_name;
          }
          if (addressComponents[i].types.includes("street_number")) {
            address += addressComponents[i].long_name;
          }
          if (addressComponents[i].types.includes("route")) {
            address += " " + addressComponents[i].long_name;
          }
        }
        setAddress(address.trim());
        setCity(city);
        setState(state);
      });
    } 
  }, [setAddress, setCity, setState, isGoogleScriptLoaded]);
}

export default SetUserAddress;
