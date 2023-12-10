const formatDtTime = (timestamp) => {
  const time = timestamp * 1000;
  const result = new Date(time);
  const options = { hour: "2-digit", minute: "2-digit" };
  const formattedTime = result.toLocaleTimeString("id-ID", options); // Menggunakan 'result' bukan 'now'
  const formattedTimeWithColons = formattedTime.replace(/\./g, ":");
  return formattedTimeWithColons;
};

export default formatDtTime;
