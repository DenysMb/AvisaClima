import { PermissionsAndroid } from "react-native";

export const requestLocationPermission = async (success: any) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Avisa Clima Location Permission",
          message:
            "Avisa Clima needs access to your location " +
            "so you can get your weather info.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        success();
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  