export const checkTimeDuration = (time) => {
  const newValue = time.split(":");
  return newValue[0] >= 3 ? true : false;
};
