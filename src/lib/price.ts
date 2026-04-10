export const formatPrice = (price: number): string => {
  const format = (value: number, suffix: string) => {
    const formatted = (price / value).toFixed(1);
    return formatted.endsWith(".0")
      ? `${parseInt(formatted)}${suffix}`
      : `${formatted}${suffix}`;
  };

  if (price >= 1_000_000_000) return format(1_000_000_000, "B");
  if (price >= 1_000_000) return format(1_000_000, "M");
  if (price >= 1_000) return format(1_000, "K");

  return price.toString();
};