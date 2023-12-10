const formatDtTxtTime = (data) => {
  const date = new Date(data);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const formattedDtTxt = `${hour}:${minute}`;
  return formattedDtTxt;
};

export default formatDtTxtTime;
