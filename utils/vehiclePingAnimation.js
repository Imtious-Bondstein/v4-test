export const vehiclePingAnimation = (vehicle) => {
  // console.log("from Utility : ", vehicle);
  // console.log("util 2 vehicle: ", vehicle);

  const pathsLength = vehicle.path.length;
  const latestPath = vehicle.path[pathsLength - 1];

  // console.log("latestPath : ", latestPath);

  let device_status = latestPath?.device_status
    ? latestPath.device_status.toLowerCase()
    : "offline";

  let engine_status = latestPath?.engine_status
    ? latestPath.engine_status
    : false;

  let speed_status = latestPath?.speed_status
    ? parseFloat(latestPath.speed_status)
    : 0;

  let last_engine_on = vehicle?.last_engine_on
    ? vehicle?.last_engine_on
    : new Date();

  const date1 = new Date();
  const date2 = new Date(last_engine_on);

  const timeDifference = (date1 - date2) / (1000 * 60 * 60);

  if (device_status === "online") {
    // console.log("online : ", engine_status, " : ", timeDifference);
    if (engine_status === false && timeDifference <= 1) {
      // pink
      return "#ffb1b1da";
    } else if (
      engine_status === false &&
      timeDifference > 1 &&
      timeDifference < 24
    ) {
      // yellow
      return "#fbc9b0ce";
    } else if (engine_status === false && timeDifference >= 24) {
      //   gray
      return "#dadadadc";
    } else if (engine_status === true && speed_status >= 5) {
      // green
      return "#ace4d4d5";
    } else if (engine_status === true && speed_status < 5) {
      // blue
      return "#bbdcffc5";
    }
  } else {
    // gray
    return "#dadadadc";
  }
};
