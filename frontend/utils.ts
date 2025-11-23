
export const formatCurrency = (val: number) => {
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (dateInput: string | Date) => {
  const d = new Date(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Calculate breakdown for UI preview only (Backend does actual logic)
export const calculatePreview = (total: number) => {
  const totalCents = Math.round(total * 100);
  const base = Math.floor(totalCents / 3);
  const remainder = totalCents % 3;
  
  const first = (base + remainder) / 100;
  const others = base / 100;
  
  return { first, others };
};
