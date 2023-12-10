export const checkColor = (colorName) => {
  if (colorName.toLowerCase() === "black") {
    return "#000000";
  } else if (colorName.toLowerCase() === "white") {
    return "#FFFFFF";
  } else if (colorName.toLowerCase() === "gray") {
    return "#808080";
  } else if (colorName.toLowerCase() === "red") {
    return "#FF0000";
  } else if (colorName.toLowerCase() === "green") {
    return "#00FF00";
  } else if (colorName.toLowerCase() === "blue") {
    return "#0000FF";
  } else if (colorName.toLowerCase() === "yellow") {
    return "#FFFF00";
  } else if (colorName.toLowerCase() === "purple") {
    return "#800080";
  } else if (colorName.toLowerCase() === "orange") {
    return "#FFA500";
  } else if (colorName.toLowerCase() === "pink") {
    return "#FFC0CB";
  } else if (colorName.toLowerCase() === "brown") {
    return "#A52A2A";
  } else if (colorName.toLowerCase() === "navy") {
    return "#000080";
  } else if (colorName.toLowerCase() === "teal") {
    return "#008080";
  } else if (colorName.toLowerCase() === "cyan") {
    return "#00FFFF";
  } else if (colorName.toLowerCase() === "lavender") {
    return "#E6E6FA";
  }
};
