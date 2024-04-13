// Function to convert duration string to milliseconds
const parseDurationToMilliseconds = (durationString) => {
  // Regular expression to match minutes and seconds
  const durationRegex = /PT(?:(\d+)M)?(?:(\d+)S)?/;

  // Extract minutes and seconds from duration string
  const [, minutes, seconds] = durationString.match(durationRegex).map(Number);

  // Calculate total milliseconds
  const totalMilliseconds = (minutes || 0) * 60 * 1000 + (seconds || 0) * 1000;

  return totalMilliseconds;
};

module.exports = {
  parseDurationToMilliseconds,
};
