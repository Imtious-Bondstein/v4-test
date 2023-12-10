export const hourToSecond = (time) => {
  if (time == 60) {
    return 1;
  } else {
    const seconds = time * 60;
    return seconds;
  }
};
