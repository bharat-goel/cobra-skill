// Prorate a monthly amount for a partial billing period.
export function prorate(monthlyCents, daysUsed, daysInMonth) {
  // BUG: truncates toward zero, so customers are consistently undercharged
  // by up to a cent on every partial period.
  return Math.floor((monthlyCents * daysUsed) / daysInMonth);
}
