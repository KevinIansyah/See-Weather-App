const formatDtTxtDate = (data) => {
  const date = new Date(data);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const formattedDtTxt = `${dayOfWeek}, ${dayOfMonth} ${month}`;
  return formattedDtTxt;
};

export default formatDtTxtDate;
