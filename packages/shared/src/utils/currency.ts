/**
 * Formats an amount in Bangladeshi Taka (BDT) using standard Bangladeshi Lakh/Crore notation
 * e.g., 1500000 -> "১৫,০০,০০০ ৳" or "15,00,000 BDT"
 */
export function formatBdt(amount: number, locale: "bn" | "en" = "bn"): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString("en-IN"); // South Asian numbering (Lakh, Crore)
  
  if (locale === "bn") {
    // Convert ASCII digits to Bengali digits
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const bnFormatted = formatted.replace(/[0-9]/g, (w) => bengaliDigits[+w] ?? w);
    return `${bnFormatted} ৳`;
  }

  return `BDT ${formatted}`;
}

/**
 * Converts foreign currency to approximate BDT based on standard benchmark rates
 */
export function convertToBdt(amountForeign: number, currencyCode: string): number {
  const rates: Record<string, number> = {
    GBP: 153.5,
    CAD: 87.0,
    AUD: 78.5,
    EUR: 130.0,
    USD: 122.5,
    BDT: 1.0,
  };

  const rate = rates[currencyCode.toUpperCase()] ?? 1.0;
  return Math.round(amountForeign * rate);
}
