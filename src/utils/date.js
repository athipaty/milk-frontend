export const buildTodayDateTime = (time) => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
  }).format(new Date());

  return new Date(`${today}T${time}`);
};
