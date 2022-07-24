function timeFormat(date) {
  console.log(date);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (date.getMinutes() < 10) {
    var minutes = `0${date.getMinutes()}`;
  } else {
    minutes = date.getMinutes();
  }

  const timeRender = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${date.getHours()}:${minutes}`;

  return timeRender;
}

module.exports = timeFormat;