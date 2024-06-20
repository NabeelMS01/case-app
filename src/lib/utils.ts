import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  let formattedPrice = formatter.format(price);

  // Check if the currency symbol is at the beginning or end
  const currencySymbol = formatter.formatToParts(price).find(part => part.type === 'currency')?.value!;
  
  // Insert a space between the currency symbol and the number
  formattedPrice = formattedPrice.replace(currencySymbol, currencySymbol + ' ');

  return formattedPrice;
}