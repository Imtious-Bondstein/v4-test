export const formatAreaName = (array) => {
  const areaString = array.map((item) => item.name).join(", ");
  return areaString;
};
