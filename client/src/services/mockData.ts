
export interface Transaction {
  id: string;
  date: string;
  time?: string;
  type: 'credit' | 'debit';
  recipient: string;
  amount: number;
  balance?: number;
  category?: string;
  notes?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  createdAt: string;
  icon: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface ReportData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  categorySpendings: {
    [key: string]: number;
  };
  comparison: {
    [key: string]: number;
  };
}

// Generate a random ID for mock data
const generateId = () => Math.random().toString(36).substring(2, 10);

// Mock transaction data
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [
    {
      id: generateId(),
      date: "2025-04-01",
      time: "19:12",
      type: "debit",
      recipient: "swiggy@ybl",
      amount: 450,
      balance: 15430,
      category: "Food"
    },
    {
      id: generateId(),
      date: "2025-04-02",
      time: "08:30",
      type: "credit",
      recipient: "salary@company",
      amount: 50000,
      balance: 65430,
      category: "Income"
    },
    {
      id: generateId(),
      date: "2025-04-03",
      time: "11:30",
      type: "debit",
      recipient: "amazon@apl",
      amount: 1200,
      balance: 64230,
      category: "Shopping"
    },
    {
      id: generateId(),
      date: "2025-04-04",
      time: "08:00",
      type: "debit",
      recipient: "netflix@axis",
      amount: 499,
      balance: 63731,
      category: "Subscriptions"
    },
    {
      id: generateId(),
      date: "2025-04-05",
      time: "20:45",
      type: "debit",
      recipient: "medlife@icici",
      amount: 800,
      balance: 62931,
      category: "Healthcare"
    },
    {
      id: generateId(),
      date: "2025-04-06",
      time: "14:25",
      type: "debit",
      recipient: "zomato@hdfc",
      amount: 670,
      balance: 62261,
      category: "Food"
    },
    {
      id: generateId(),
      date: "2025-04-07",
      time: "09:15",
      type: "debit",
      recipient: "uber@paytm",
      amount: 350,
      balance: 61911,
      category: "Transport"
    },
    {
      id: generateId(),
      date: "2025-04-08",
      time: "17:40",
      type: "debit",
      recipient: "flipkart@axis",
      amount: 1800,
      balance: 60111,
      category: "Shopping"
    },
    {
      id: generateId(),
      date: "2025-04-09",
      time: "12:20",
      type: "debit",
      recipient: "rent@landlord",
      amount: 15000,
      balance: 45111,
      category: "Housing"
    },
    {
      id: generateId(),
      date: "2025-04-10",
      time: "10:30",
      type: "debit",
      recipient: "electricity@adani",
      amount: 2200,
      balance: 42911,
      category: "Utilities"
    },
    {
      id: generateId(),
      date: "2025-04-12",
      time: "16:15",
      type: "debit",
      recipient: "bigbasket@sbi",
      amount: 1500,
      balance: 41411,
      category: "Groceries"
    },
    {
      id: generateId(),
      date: "2025-04-15",
      time: "19:30",
      type: "debit",
      recipient: "phonepe@mobile",
      amount: 799,
      balance: 40612,
      category: "Utilities"
    }
  ];

  return transactions;
};

// Mock goals data
const generateGoals = (): Goal[] => {
  return [
    {
      id: generateId(),
      name: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 45000,
      targetDate: "2025-08-30",
      createdAt: "2025-01-15",
      icon: "ShieldAlert"
    },
    {
      id: generateId(),
      name: "New Laptop",
      targetAmount: 80000,
      currentAmount: 20000,
      targetDate: "2025-07-15",
      createdAt: "2025-03-01",
      icon: "Laptop"
    },
    {
      id: generateId(),
      name: "Vacation in Bali",
      targetAmount: 150000,
      currentAmount: 35000,
      targetDate: "2025-12-01",
      createdAt: "2025-02-20",
      icon: "Palmtree"
    },
    {
      id: generateId(),
      name: "iPhone 16",
      targetAmount: 120000,
      currentAmount: 10000,
      targetDate: "2025-10-15",
      createdAt: "2025-04-01",
      icon: "Smartphone"
    }
  ];
};

// Mock alerts data
const generateAlerts = (): Alert[] => {
  return [
    {
      id: generateId(),
      title: "Shopping Spend Alert",
      description: "Your shopping expenses are 35% higher than last month.",
      type: "warning",
      date: "2025-04-12",
      read: false
    },
    {
      id: generateId(),
      title: "Subscription Renewal",
      description: "Your Netflix subscription will renew in 3 days.",
      type: "info",
      date: "2025-04-11",
      read: true
    },
    {
      id: generateId(),
      title: "Don't open Amazon today 😅",
      description: "You've already spent ₹3,000 on shopping this month.",
      type: "warning",
      date: "2025-04-10",
      read: false
    },
    {
      id: generateId(),
      title: "Savings Goal Achieved!",
      description: "You've reached 50% of your Emergency Fund goal!",
      type: "success",
      date: "2025-04-09",
      read: true
    },
    {
      id: generateId(),
      title: "Food spending high",
      description: "Swiggy/Zomato spends are up 30% this month!",
      type: "warning",
      date: "2025-04-08",
      read: false
    }
  ];
};

// Mock challenges data
const generateChallenges = (): Challenge[] => {
  return [
    {
      id: generateId(),
      title: "No Spend Weekend",
      description: "Don't spend any money this weekend",
      reward: "Budget Ninja Badge",
      progress: 50,
      startDate: "2025-04-13",
      endDate: "2025-04-14",
      completed: false
    },
    {
      id: generateId(),
      title: "Grocery Budget Master",
      description: "Keep grocery spending under ₹2,000 this week",
      reward: "100 Points",
      progress: 75,
      startDate: "2025-04-10",
      endDate: "2025-04-16",
      completed: false
    },
    {
      id: generateId(),
      title: "Pack Lunch Week",
      description: "Don't order lunch for a week",
      reward: "Meal Prep Master Badge",
      progress: 60,
      startDate: "2025-04-08",
      endDate: "2025-04-14",
      completed: false
    },
    {
      id: generateId(),
      title: "Subscription Audit",
      description: "Review and cancel unused subscriptions",
      reward: "200 Points",
      progress: 100,
      startDate: "2025-04-01",
      endDate: "2025-04-07",
      completed: true
    }
  ];
};

// Mock badges data
const generateBadges = (): Badge[] => {
  return [
    {
      id: generateId(),
      name: "Budget Ninja",
      description: "Successfully stayed within budget for 3 consecutive months",
      icon: "Award",
      unlockedAt: "2025-03-31"
    },
    {
      id: generateId(),
      name: "Savings Champion",
      description: "Saved ₹10,000 in a single month",
      icon: "Trophy",
      unlockedAt: "2025-02-28"
    },
    {
      id: generateId(),
      name: "Goal Crusher",
      description: "Achieved your first savings goal",
      icon: "Target",
      unlockedAt: null
    },
    {
      id: generateId(),
      name: "Expense Tracker",
      description: "Categorized 100 transactions",
      icon: "BadgeCheck",
      unlockedAt: "2025-01-15"
    },
    {
      id: generateId(),
      name: "Finance Scholar",
      description: "Completed all financial education modules",
      icon: "GraduationCap",
      unlockedAt: null
    }
  ];
};

// Mock report data
const generateReportData = (): ReportData => {
  return {
    month: "April 2025",
    totalIncome: 50000,
    totalExpense: 38000,
    totalSavings: 12000,
    categorySpendings: {
      Housing: 15000,
      Food: 6000,
      Transport: 3000,
      Utilities: 4000,
      Shopping: 5000,
      Entertainment: 2000,
      Healthcare: 1500,
      Others: 1500
    },
    comparison: {
      Housing: 0,
      Food: 30,
      Transport: -10,
      Utilities: 5,
      Shopping: 35,
      Entertainment: -20,
      Healthcare: 15,
      Others: -5
    }
  };
};

export const mockDataService = {
  getTransactions: () => generateTransactions(),
  getGoals: () => generateGoals(),
  getAlerts: () => generateAlerts(),
  getChallenges: () => generateChallenges(),
  getBadges: () => generateBadges(),
  getReportData: () => generateReportData()
};
