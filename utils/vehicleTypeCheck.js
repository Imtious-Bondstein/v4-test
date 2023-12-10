// SELECTOR IMAGES START
import carImageF from "../public/Vehicle_Icons/carF.png";
import bikeImageF from "../public/Vehicle_Icons/bikeF.png";
import busImageF from "../public/Vehicle_Icons/busF.png";
import pickupImageF from "../public/Vehicle_Icons/pickupF.png";
import truckImageF from "../public/Vehicle_Icons/truckF.png";
// SELECTOR IMAGES ENDS

import carImage from "../public/Vehicle_Icons/car.png";
import bikeImage from "../public/Vehicle_Icons/bike.png";
import busImage from "../public/Vehicle_Icons/bus.png";
import pickupImage from "../public/Vehicle_Icons/pickup.png";
import truckImage from "../public/Vehicle_Icons/truck.png";

// HORIZONTAL IMAGES (-)
import carImageH from "../public/Vehicle_Icons/carH.png";
import bikeImageH from "../public/Vehicle_Icons/bikeH.png";
import busImageH from "../public/Vehicle_Icons/busH.png";
import pickupImageH from "../public/Vehicle_Icons/pickupH.png";
import truckImageH from "../public/Vehicle_Icons/truckH.png";

export const handleVehicleType = (type) => {
  if (type === "car") {
    return carImage.src;
  } else if (type === "bike") {
    return bikeImage.src;
  } else if (type === "bus") {
    return busImage.src;
  } else if (type === "pickup") {
    return pickupImage.src;
  } else if (type === "truck") {
    return truckImage.src;
  } else {
    return carImage.src;
  }
};

// FOR VEHICLE ROUTE & SHARE VEHICLE ROUTE
export const handleRouteVehicleType = (type) => {
  if (type === "car") {
    return carImageH.src;
  } else if (type === "bike") {
    return bikeImageH.src;
  } else if (type === "bus") {
    return busImageH.src;
  } else if (type === "pickup") {
    return pickupImageH.src;
  } else if (type === "truck") {
    return truckImageH.src;
  } else {
    return carImageH.src;
  }
};

// FOR SELECTORS
export const handleSelectorVehicleType = (type) => {
  if (type === "car") {
    return carImageF.src;
  } else if (type === "bike") {
    return bikeImageF.src;
  } else if (type === "bus") {
    return busImageF.src;
  } else if (type === "pickup") {
    return pickupImageF.src;
  } else if (type === "truck") {
    return truckImageF.src;
  } else {
    return carImageF.src;
  }
};
