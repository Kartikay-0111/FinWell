import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: INR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates the number of days left until a target date
 * @param targetDate The target date (string in YYYY-MM-DD format)
 * @returns Number of days left (0 if date is in the past)
 */
export function calculateDaysLeft(targetDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Calculates the percentage of progress
 * @param current The current value
 * @param target The target value
 * @returns Percentage as a number between 0-100
 */
export function calculatePercentage(current: number, target: number): number {
  if (target === 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(100, Math.round(percentage));
}

export const generateGeminiPrompt = (transactions: any[], userQuery: string) => {
  const categories = [
    "Healthcare", "Food", "Shopping", "Subscriptions",
    "Utilities", "Transport", "Entertainment", "Housing"
  ];

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalTransactions = transactions.length;
  const manualEntries = transactions.filter(t => t.is_manual).length;
  const uniqueDates = Array.from(new Set(transactions.map(t => t.transaction_date)));
  const avgSpendPerDay = (totalSpent / uniqueDates.length).toFixed(2);

  const categorySummary = categories.map(cat => {
    const catTotal = transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return `- ${cat}: ₹${catTotal.toFixed(2)}`;
  }).join('\n');

  const recentTxns = transactions.slice(0, 10).map(t =>
    `- ${t.transaction_date}: ₹${t.amount} | ${t.type} | ${t.category || 'Uncategorized'} | ${t.receiver_id || 'N/A'}`
  ).join('\n');

  return `
You are a personal finance assistant.

### Objective:
The user asked: "${userQuery}"

Use the financial data below to answer **clearly and helpfully**, tailoring the output to their request.

### Financial Summary:
- Total Transactions: ${totalTransactions}
- Total Spent: ₹${totalSpent.toFixed(2)}
- Total Income: ₹${totalIncome.toFixed(2)}
- Avg Spend Per Day: ₹${avgSpendPerDay}
- Manual Entries: ${manualEntries}

### Category-wise Spending:
${categorySummary}

### Recent Transactions:
${recentTxns}

Respond as:
1. Insightful analysis or summary based on the user's question.
2. If unclear, assume the user wants spending patterns, alerts, or suggestions.
3. Keep it friendly, helpful, and not overly technical.
`;
};