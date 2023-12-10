export const sevenDaysTravelDistance = () => {
  // Get the current date
  const currentDate = new Date();

  // Create an empty array to store the last seven days
  const lastSevenDaysArray = [];

  // Loop through the last seven days
  for (let i = 0; i < 7; i++) {
    // Create a new date by subtracting the day index from the current date
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);

    // Format the date as "YYYY-MM-DD"
    const formattedDate = date.toISOString().split("T")[0];

    // Create an object with the formatted date, distance, and vehicle
    const item = {
      date: formattedDate,
      distance: 0,
      vehicle: 0,
    };

    // Push the item into the lastSevenDaysArray
    lastSevenDaysArray.push(item);
  }

  return lastSevenDaysArray;
};

export const sevenDaysTrips = () => {
  // Get the current date
  const currentDate = new Date();

  // Create an empty array to store the last seven days
  const lastSevenDaysArray = [];

  // Loop through the last seven days
  for (let i = 0; i < 7; i++) {
    // Create a new date by subtracting the day index from the current date
    const date = new Date(currentDate);
    date.setDate(date.getDate() - i);

    // Format the date as "YYYY-MM-DD"
    const formattedDate = date.toISOString().split("T")[0];

    // Create an object with the formatted date, distance, and vehicle
    const item = {
      date: formattedDate,
      trips: 0,
    };

    // Push the item into the lastSevenDaysArray
    lastSevenDaysArray.push(item);
  }

  return lastSevenDaysArray;
};
