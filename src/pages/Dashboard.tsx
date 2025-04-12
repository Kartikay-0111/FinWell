
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { ArrowDown, ArrowUp, Banknote, Calendar, CreditCard, Landmark, AlertTriangle } from "lucide-react";
import { mockDataService, Transaction } from "@/services/mockData";
import { formatCurrency } from "@/lib/utils";

// Component for summary metrics
const SummaryCard = ({ 
  title, 
  value, 
  delta,
  icon,
  description,
}: {
  title: string;
  value: number;
  delta: number;
  icon: React.ReactNode;
  description: string;
}) => {
  const isPositive = delta > 0;
  
  return (
    <Card className="fin-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-finLightGray">{title}</CardTitle>
        <div className="bg-finOrange/10 p-2 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold animate-number-count">
          {formatCurrency(value)}
        </div>
        <div className="flex items-center mt-1">
          {isPositive ? (
            <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-500/30">
              <ArrowUp className="h-3 w-3 mr-1" /> {delta}%
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-500/30">
              <ArrowDown className="h-3 w-3 mr-1" /> {Math.abs(delta)}%
            </Badge>
          )}
          <p className="text-xs text-finLightGray ml-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for transaction timeline
const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const isCredit = transaction.type === "credit";
  
  // Get the icon based on recipient
  const getIcon = (recipient: string) => {
    if (recipient.includes("swiggy") || recipient.includes("zomato")) {
      return "🍔";
    } else if (recipient.includes("amazon") || recipient.includes("flipkart")) {
      return "🛒";
    } else if (recipient.includes("netflix") || recipient.includes("prime")) {
      return "📺";
    } else if (recipient.includes("uber") || recipient.includes("ola")) {
      return "🚗";
    } else if (recipient.includes("salary")) {
      return "💼";
    } else if (recipient.includes("rent")) {
      return "🏠";
    } else {
      return "💸";
    }
  };
  
  // Determine if transaction is a subscription
  const isSubscription = transaction.recipient.includes("netflix") || 
                         transaction.recipient.includes("prime") ||
                         transaction.recipient.includes("spotify");
  
  // Determine if transaction is a large spend (more than 5000)
  const isLargeSpend = transaction.amount > 5000;
  
  // Determine if transaction is an anomaly (random for demo)
  const isAnomaly = transaction.recipient.includes("amazon") && transaction.amount > 1000;
  
  return (
    <div className="p-4 border-b border-finDarkBlue last:border-0 hover:bg-finDarkBlue/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-finOrange/10 flex items-center justify-center text-xl mr-3">
            {getIcon(transaction.recipient)}
          </div>
          <div>
            <p className="font-medium">
              {transaction.recipient.split('@')[0].charAt(0).toUpperCase() + transaction.recipient.split('@')[0].slice(1)}
            </p>
            <p className="text-xs text-finLightGray">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-medium ${isCredit ? "text-green-500" : "text-finWhite"}`}>
            {isCredit ? "+" : "-"}{formatCurrency(transaction.amount)}
          </p>
          <div className="flex mt-1 justify-end">
            {isSubscription && (
              <Badge variant="outline" className="text-xs bg-blue-900/20 text-blue-500 border-blue-500/30 mr-1">
                Subscription
              </Badge>
            )}
            {isLargeSpend && (
              <Badge variant="outline" className="text-xs bg-finOrange/20 text-finOrange border-finOrange/30 mr-1">
                Large Spend
              </Badge>
            )}
            {isAnomaly && (
              <Badge variant="outline" className="text-xs bg-red-900/20 text-red-500 border-red-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" /> Anomaly
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [savingsTotal, setSavingsTotal] = useState(0);
  
  useEffect(() => {
    // Fetch transactions
    const data = mockDataService.getTransactions();
    setTransactions(data);
    
    // Calculate totals
    const income = data.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
    const expenses = data.filter(t => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);
    const savings = income - expenses;
    
    setIncomeTotal(income);
    setExpenseTotal(expenses);
    setSavingsTotal(savings);
  }, []);
  
  // Prepare data for pie chart - spending by category
  const categoryData = transactions
    .filter(t => t.type === "debit" && t.category)
    .reduce((acc: {name: string, value: number}[], t) => {
      const existingCategory = acc.find(c => c.name === t.category);
      if (existingCategory) {
        existingCategory.value += t.amount;
      } else if (t.category) {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);
    
  // Prepare data for line chart - daily spend trend
  const dateMap = new Map<string, number>();
  transactions
    .filter(t => t.type === "debit")
    .forEach(t => {
      const date = t.date;
      dateMap.set(date, (dateMap.get(date) || 0) + t.amount);
    });
    
  const lineChartData = Array.from(dateMap.entries())
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: amount
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  // Colors for pie chart
  const COLORS = ['#FCA311', '#E16036', '#5D87E6', '#4C9F70', '#7C65E6', '#E663A9', '#6EC8E6', '#D1D462'];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-finWhite">Dashboard</h1>
        <p className="text-finLightGray">Welcome back! Here's your financial overview.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard 
          title="Total Income" 
          value={incomeTotal} 
          delta={12} 
          icon={<Banknote className="h-5 w-5 text-finOrange" />}
          description="vs last month"
        />
        <SummaryCard 
          title="Total Expenses" 
          value={expenseTotal} 
          delta={-8} 
          icon={<CreditCard className="h-5 w-5 text-finOrange" />}
          description="vs last month"
        />
        <SummaryCard 
          title="Total Savings" 
          value={savingsTotal} 
          delta={23} 
          icon={<Landmark className="h-5 w-5 text-finOrange" />}
          description="vs last month"
        />
      </div>
      
      {/* Charts and Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts Section */}
        <Tabs defaultValue="pie" className="fin-card p-4">
          <TabsList className="bg-finDarkBlue border border-finLightGray/20 mb-4">
            <TabsTrigger value="pie">Spending by Category</TabsTrigger>
            <TabsTrigger value="line">Daily Spend Trend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pie" className="mt-0">
            <h2 className="text-lg font-medium mb-4">Spending by Category</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#14213D', borderColor: '#FCA311' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="line" className="mt-0">
            <h2 className="text-lg font-medium mb-4">Daily Spend Trend</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3A5C" />
                  <XAxis dataKey="date" stroke="#E5E5E5" />
                  <YAxis stroke="#E5E5E5" />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: '#14213D', borderColor: '#FCA311' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#FCA311"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Transactions Timeline */}
        <Card className="fin-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Badge className="bg-finOrange text-finDarkBlue hover:bg-finOrange/80">
                <Calendar className="h-3 w-3 mr-1" /> Last 7 days
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px]">
              {transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
