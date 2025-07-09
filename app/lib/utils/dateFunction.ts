export function formatNepalDateForQueryNepalTZ(date: Date): string {
  const nepalTime = new Date(date.getTime() + (5 * 60 + 45) * 60 * 1000);

  // Format as ISO string with +05:45
  const isoString = nepalTime.toISOString().replace("Z", "+05:45");

  return encodeURIComponent(isoString);
}
