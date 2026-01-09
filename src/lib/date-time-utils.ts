export const convertTo12Hour = (time24: string, short?: boolean): string => {
  const parts = time24.split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return short
    ? `${hours12} ${period}`
    : `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};
