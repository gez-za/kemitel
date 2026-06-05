/**
 * Robust date formatting utility for Kemitel.
 * Handles Firestore Timestamps, ISO strings, Numbers, and Date objects.
 */

export const formatDate = (date: any): string => {
  if (date === null || date === undefined) return 'N/A';
  
  let d: Date;

  // Handle Firestore Timestamp { seconds, nanoseconds }
  if (typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  } 
  // Handle Number (milliseconds)
  else if (typeof date === 'number') {
    d = new Date(date);
  }
  // Handle String or existing Date object
  else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return 'N/A';

  // Format: DD/MM/YYYY
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (date: any): string => {
  if (date === null || date === undefined) return 'N/A';
  
  let d: Date;

  if (typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  } else if (typeof date === 'number') {
    d = new Date(date);
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number | string | undefined): string => {
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (val === undefined || isNaN(val)) return '0 FCFA';
  
  return new Intl.NumberFormat('fr-CM', { 
    style: 'currency', 
    currency: 'XAF',
    maximumFractionDigits: 0
  }).format(val).replace('XAF', 'FCFA');
};

/**
 * Calculates the progress percentage of a subscription.
 */
export const calculateSubscriptionProgress = (start: any, end: any): number => {
  if (!start || !end) return 0;

  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const now = new Date().getTime();

  if (isNaN(startDate) || isNaN(endDate)) return 0;
  if (now < startDate) return 0;
  if (now > endDate) return 100;

  const total = endDate - startDate;
  const elapsed = now - startDate;
  
  return Math.round((elapsed / total) * 100);
};

/**
 * Masks insurance number based on visibility preference.
 * Format: INS-***-456 or similar.
 */
export const maskInsuranceNumber = (num: string | undefined, isMasked: boolean = true): string => {
  if (!num) return '***-***-***';
  if (!isMasked) return num;

  const len = num.length;
  if (len < 6) return '***' + num.slice(-2);

  const parts = num.split('-');
  if (parts.length >= 3) {
    const prefix = parts[0];
    const middle = '***';
    const suffix = parts[parts.length - 1].slice(-3);
    return `${prefix}-${middle}-${suffix}`;
  }

  return num.slice(0, 2) + '***' + num.slice(-3);
};
