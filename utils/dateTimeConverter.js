import moment from "moment/moment";

export const vehicleDateTime = (dateTime) => {
  return moment(dateTime).format("DD MMM, YYYY hh:mm a");
};

export const vehicleTime = (dateTime) => {
  const currentTime = moment();
  const providedTime = moment(dateTime);

  const timeDifferenceMs = currentTime.diff(providedTime);
  const duration = moment.duration(timeDifferenceMs);
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  const totalDiff = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return totalDiff;
};

export const vehicleTimeAgo = (dateTime) => {
  const currentTime = moment();
  const providedTime = moment(dateTime);

  const timeDifferenceMs = currentTime.diff(providedTime);
  const duration = moment.duration(timeDifferenceMs);
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let totalDiff;
  if (days > 0) {
    totalDiff = `${days} days ago`;
  } else if (days <= 0 && hours > 0) {
    totalDiff = `${hours} hours ago`;
  } else if (days <= 0 && hours <= 0 && minutes > 0) {
    totalDiff = `${minutes} minutes ago`;
  } else if (days <= 0 && hours <= 0 && minutes <= 0 && seconds > 0) {
    totalDiff = `${seconds} seconds ago`;
  }
  return totalDiff;
};

export const notificationTime = (dateTime) => {
  return moment(dateTime).format("hh:mm a");
};

export const notificationDate = (dateTime) => {
  return moment(dateTime).format("DD/MM/YYYY");
};

export const infoWindowDateTime = (dateTime) => {
  return moment(dateTime).format("hh:mm:ss A, DD MMM, YYYY");
};
export const vehicleRouteChartHour = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("h A");
};
export const vehicleRouteChartTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("hh:mm a");
};
export const vehicleRouteChartDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM, YYYY");
};

export const deviceDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM YYYY");
};

export const vehicleRouteDateTimePicker = (dateTime) => {
  return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
};

export const analyticsTripsNumberDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM");
};

export const analyticsTraveledDistanceDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("ddd DD MMM");
};

export const analyticsAlertSummary = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM YYYY");
};

export const getYearMonthDay = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("YYYY-MM-DD");
};

export const monthlyDistanceDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("MMM");
};
export const monthlyDistanceDTotalDay = (dateTime) => {
  const month = moment().month(dateTime);
  const totalDays = month.daysInMonth();
  return totalDays;
};
export const monthlyDistanceMonth = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("YYYY-MM");
};
// export const getOnlyDay = (dateTime) => {
//   const formattedDate = new Date(dateTime);
//   return moment(formattedDate).format("D");
// };
export const getOnlyDay = (dateString) => {
  var dateParts = dateString.split("T")[0].split("-");
  var day = dateParts[2];
  return day;
};

export const shareLinkDateTime = (dateTime) => {
  return moment(dateTime).format("DD MMMM [at] hh:mm a");
};

export const shareLinkDateTimeCheck = (dateTime) => {
  const currentTime = moment();
  if (dateTime) {
    if (moment(dateTime).isAfter(currentTime)) {
      return false;
    } else {
      return true;
    }
  }
};

export const hourlyDistanceTableDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMMM, YYYY");
};
export const hourlyDistanceTableTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("hh:mm:ss");
};

export const hourlyDistanceChartTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("HH");
};

export const dailyDistanceTableTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("hh:mm:ss A");
};
export const dailyDistanceTableTimes = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("hh:mm:ss A");
};

export const dailyDistanceChartDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM");
};

export const dashboardDate = (dateTime) => {
  return moment(dateTime).format("DD/MM/YYYY");
};

export const dashboardTime = (dateTime) => {
  return moment(dateTime).format("hh:mm:ss a");
};

export const hourlyDistanceDateTimePicker = (dateTime) => {
  return moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
};

export const convertTimeOnly = (inputTime) => {
  // Check if inputTime is defined and is a non-empty string
  if (typeof inputTime !== "string" || inputTime.trim() === "") {
    return "";
  }

  // Split the input time by ':'
  const timeParts = inputTime.split(":");

  // Check if the input time has the correct format (HH:mm:ss)
  if (timeParts.length !== 3) {
    return "";
  }

  // Extract hours, minutes, and seconds from the split parts
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  // Convert hours to 12-hour format and determine if it's AM or PM
  const ampm = hours >= 12 ? "pm" : "am";
  const twelveHourFormat = hours % 12 || 12;

  // Return the formatted time string
  return `${twelveHourFormat}:${minutes} ${ampm}`;
};

export const speedReportTableDate = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMMM YYYY | hh:mm a");
};

export const engineReportChartTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("hh a");
};
export const geoFenceTime24 = (dateTime) => {
  return moment(dateTime).format("HH:mm:ss");
};

export const geofenceMainTableTimeOnly = (dateTime) => {
  const time = moment(dateTime, "hh:mm:ss");
  return time.format("hh:mm a");
};

export const testdatesCheck = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD/MM/YYYY");
};

export const locationShareListDateTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM YYYY | hh:mm a");
};

export const routeShareListDateTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("DD MMM YYYY | hh:mm a");
};

export const monthlyDistanceReportExportDateTime = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("YYYY-MM");
};

export const locationDates = (dateTime) => {
  const formattedDate = new Date(dateTime);
  return moment(formattedDate).format("HH:mm:ss");
};
