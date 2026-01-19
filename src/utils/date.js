const TZ = "Asia/Singapore";

export const sgDate = (date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(date));

export const sgTime = (date) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const durationMinutes = (start, end) =>
  Math.round((new Date(end) - new Date(start)) / 60000);
