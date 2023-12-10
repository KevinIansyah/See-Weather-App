const formatDtDate = (dt, timezone) => {
  const timestamp = (dt + timezone) * 1000;
  const result = new Date(timestamp);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const formattedDate = result.toLocaleDateString("en-US", options); // Ganti "en-US" dengan kode zona waktu yang sesuai jika diperlukan
  return formattedDate;
};

export default formatDtDate;
