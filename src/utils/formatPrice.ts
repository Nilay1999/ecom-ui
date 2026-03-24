/**
 * Format a numeric price as Indian Rupees (INR).
 * Backend stores prices as BigDecimal; API returns them as numbers.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
