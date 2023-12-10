export const vehiclePingAnimationOld = (vehicle) => {
  // console.log("from Utility : ", vehicle);

  let device_status = vehicle?.device_status
    ? vehicle?.device_status?.toLowerCase()
    : "offline";

  let engine_status = vehicle?.engine_status ? vehicle.engine_status : false;

  let speed_status = vehicle?.speed_status
    ? parseFloat(vehicle?.speed_status)
    : 0;

  let last_engine_on = vehicle?.last_engine_on
    ? vehicle?.last_engine_on
    : new Date();

  const date1 = new Date();
  const date2 = new Date(last_engine_on);

  const timeDifference = (date1 - date2) / (1000 * 60 * 60);

  if (device_status === "online") {
    if (engine_status === false && timeDifference <= 1) {
      // console.log("pink", timeDifference);
      return "#ffb1b1da";
    } else if (
      engine_status === false &&
      timeDifference > 1 &&
      timeDifference < 24
    ) {
      // console.log("yellow", timeDifference);
      return "#fbc9b0ce";
    } else if (engine_status === true && speed_status >= 5) {
      // console.log("green");
      return "#ace4d4d5";
    } else if (engine_status === true && speed_status < 5) {
      // console.log("blue", timeDifference);
      return "#bbdcffc5";
    }
  } else {
    // console.log("gray");
    return "#dadadadc";
  }
};
