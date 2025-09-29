export const getTodaysDate = () => {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formatDate = date.toISOString().split("T")[0];

  return formatDate;
};
