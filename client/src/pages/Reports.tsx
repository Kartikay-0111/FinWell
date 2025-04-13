
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown, 
  Share2, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import TopMerchantsExample from "@/examples/TopMerchantsExample";

// Define the interface for report data
interface ReportData {
  month: string;
  totalSavings: number;
  totalIncome: number;
  totalExpense: number;
  categorySpendings: Record<string, number>;
  comparison: Record<string, number>;
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [shareEnabled, setShareEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  // console.log(user);

  useEffect(() => {
    if (user) {
      fetchReportData();
    }
  }, [user]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Get current date info
      const now = new Date();
      const currentMonth = now.toLocaleString('default', { month: 'long' });
      const currentYear = now.getFullYear();
      
      // Get first day of current month and previous month
      const firstDayCurrentMonth = new Date(currentYear, now.getMonth(), 1);
      const lastDayCurrentMonth = new Date(currentYear, now.getMonth() + 1, 0);
      const firstDayPreviousMonth = new Date(currentYear, now.getMonth() - 1, 1);
      const lastDayPreviousMonth = new Date(currentYear, now.getMonth(), 0);
      
      // Format dates for queries
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      // Fetch current month transactions
      const { data: currentMonthTransactions, error: currentMonthError } = await supabase
        .from('transactions')
        .select('*')
        // .eq('user_id', user?.id)
        .gte('transaction_date', formatDate(firstDayCurrentMonth))
        .lte('transaction_date', formatDate(lastDayCurrentMonth));
        
      if (currentMonthError) throw currentMonthError;
      
      // Fetch previous month transactions
      const { data: previousMonthTransactions, error: previousMonthError } = await supabase
        .from('transactions')
        .select('*')
        // .eq('user_id', user?.id)
        .gte('transaction_date', formatDate(firstDayPreviousMonth))
        .lte('transaction_date', formatDate(lastDayPreviousMonth));

      // console.log(previousMonthTransactions);
        
      if (previousMonthError) throw previousMonthError;
      
      // Calculate totals for current month
      const currentIncome = currentMonthTransactions
        .filter(t => t.type === 'credit')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      const currentExpense = currentMonthTransactions
        .filter(t => t.type === 'debit')
        .reduce((sum, t) => sum + Number(t.amount), 0);
        
      const currentSavings = currentIncome - currentExpense;
      
      // Calculate category spendings for current month
      const categorySpendings: Record<string, number> = {};
      currentMonthTransactions
        .filter(t => t.type === 'debit')
        .forEach(t => {
          const category = t.category || 'Uncategorized';
          categorySpendings[category] = (categorySpendings[category] || 0) + Number(t.amount);
        });
      
      // Calculate comparison percentages between months
      const comparison: Record<string, number> = {};
      
      // Group previous month transactions by category
      const previousCategorySpendings: Record<string, number> = {};
      previousMonthTransactions
        .filter(t => t.type === 'debit')
        .forEach(t => {
          const category = t.category || 'Uncategorized';
          previousCategorySpendings[category] = (previousCategorySpendings[category] || 0) + Number(t.amount);
        });
      
      // Calculate percentage changes
      Object.keys(categorySpendings).forEach(category => {
        const currentAmount = categorySpendings[category] || 0;
        const previousAmount = previousCategorySpendings[category] || 0;
        
        if (previousAmount === 0) {
          comparison[category] = 100; // New category
        } else {
          const change = ((currentAmount - previousAmount) / previousAmount) * 100;
          comparison[category] = Math.round(change);
        }
      });
      
      // Build the report data object
      const reportData: ReportData = {
        month: currentMonth,
        totalSavings: currentSavings,
        totalIncome: currentIncome,
        totalExpense: currentExpense,
        categorySpendings,
        comparison
      };
      
      setReportData(reportData);
    } catch (error: any) {
      toast({
        title: "Error fetching report data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-finOrange border-t-transparent rounded-full" />
      </div>
    );
  }

  // If no data is loaded yet
  if (!reportData) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-finLightGray">No report data available. Try adding some transactions first.</p>
      </div>
    );
  }

  // Prepare data for the comparison chart
  const comparisonData = Object.entries(reportData.categorySpendings)
    .map(([category, amount]) => ({
      category,
      currentMonth: amount,
      previousMonth: amount * (1 - reportData.comparison[category] / 100),
      change: reportData.comparison[category]
    }))
    .sort((a, b) => b.currentMonth - a.currentMonth)
    .slice(0, 5); // Show only top 5 categories

// console.log(reportData);
// console.log(comparisonData);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-finWhite">Financial Reports</h1>
          <p className="text-finLightGray">Insights and analysis of your spending patterns</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-finOrange text-finDarkBlue hover:bg-finOrange/80">
            <Calendar className="h-3 w-3 mr-1" /> {reportData.month}
          </Badge>
          <div className="flex items-center space-x-2">
            <Switch 
              id="share-data" 
              checked={shareEnabled}
              onCheckedChange={setShareEnabled}
            />
            <Label htmlFor="share-data" className="text-finLightGray">Enable sharing</Label>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Card */}
        <Card className="fin-card bg-gradient-to-br from-finDarkBlue to-finDarkBlue/80 col-span-1 md:col-span-2 fin-hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-finWhite">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold text-finWhite mb-2">
                  You saved {formatCurrency(reportData.totalSavings)} this month!
                </h3>
                <p className="text-finLightGray">
                  That's {reportData.totalIncome > 0 ? 
                    `${(reportData.totalSavings / reportData.totalIncome * 100).toFixed(0)}% of your income` : 
                    '0% of your income'}. 
                  {reportData.totalSavings > 10000 
                    ? " Great job! 🎉" 
                    : " Keep going to reach your goals."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-finDarkBlue/50 p-4 rounded-lg flex items-center">
                  <div className="bg-green-900/20 p-3 rounded-full mr-3">
                    <Wallet className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-finLightGray text-sm">Total Income</p>
                    <p className="text-finWhite font-bold text-xl">{formatCurrency(reportData.totalIncome)}</p>
                  </div>
                </div>
                <div className="bg-finDarkBlue/50 p-4 rounded-lg flex items-center">
                  <div className="bg-red-900/20 p-3 rounded-full mr-3">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-finLightGray text-sm">Total Expenses</p>
                    <p className="text-finWhite font-bold text-xl">{formatCurrency(reportData.totalExpense)}</p>
                  </div>
                </div>
              </div>
              
              {shareEnabled && (
                <div className="flex space-x-2">
                  <Button className="bg-[#25D366] hover:bg-[#25D366]/90 text-white">
                    <Share2 className="h-4 w-4 mr-2" /> Share on WhatsApp
                  </Button>
                  <Button className="bg-[#0072C6] hover:bg-[#0072C6]/90 text-white">
                    <Share2 className="h-4 w-4 mr-2" /> Share via Email
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Spending Insights */}
        <Card className="fin-card fin-hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-finWhite">Spending Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.comparison)
                .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                .slice(0, 3)
                .map(([category, change]) => (
                  <div 
                    key={category} 
                    className="p-3 rounded-lg bg-finDarkBlue/50 flex items-center justify-between"
                  >
                    <span className="text-finWhite">{category}</span>
                    <div className={`flex items-center ${change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-finLightGray'}`}>
                      {change > 0 ? (
                        <>
                          <ArrowUp className="h-4 w-4 mr-1" /> {change}%
                        </>
                      ) : change < 0 ? (
                        <>
                          <ArrowDown className="h-4 w-4 mr-1" /> {Math.abs(change)}%
                        </>
                      ) : (
                        <>0%</>
                      )}
                    </div>
                  </div>
                ))}
                
              <div className="text-finOrange font-medium mt-2">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                {Object.entries(reportData.comparison).find(([_, change]) => change > 20)?.[0] || "Shopping"} spend is significantly higher this month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <TopMerchantsExample />
      {/* Category Comparison Chart */}
      <Card className="fin-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-finWhite">Category Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4 bg-finDarkBlue border border-finLightGray/20">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="h-[350px]">
              {comparisonData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-finLightGray">
                  <p>No transaction data available for comparison</p>
                  <p className="text-sm mt-2">Add some transactions to see category comparisons</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    barSize={30}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A3A5C" />
                    <XAxis 
                      dataKey="category" 
                      stroke="#E5E5E5"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                      tickMargin={20}
                    />
                    <YAxis stroke="#E5E5E5" />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#14213D', borderColor: '#FCA311' }}
                    />
                    <Bar 
                      name="Current Month" 
                      dataKey="currentMonth" 
                      fill="#FCA311"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Previous Month" 
                      dataKey="previousMonth" 
                      fill="#5D87E6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="table">
              {comparisonData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-finLightGray">
                  <p>No transaction data available for comparison</p>
                  <p className="text-sm mt-2">Add some transactions to see category comparisons</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-finLightGray/20">
                        <th className="text-left py-2 px-4 text-finLightGray">Category</th>
                        <th className="text-right py-2 px-4 text-finLightGray">Current Month</th>
                        <th className="text-right py-2 px-4 text-finLightGray">Previous Month</th>
                        <th className="text-right py-2 px-4 text-finLightGray">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item) => (
                        <tr key={item.category} className="border-b border-finLightGray/10">
                          <td className="py-3 px-4 text-finWhite">{item.category}</td>
                          <td className="py-3 px-4 text-right text-finWhite">{formatCurrency(item.currentMonth)}</td>
                          <td className="py-3 px-4 text-right text-finWhite">{formatCurrency(item.previousMonth)}</td>
                          <td className={`py-3 px-4 text-right flex items-center justify-end ${
                            item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-green-500' : 'text-finLightGray'
                          }`}>
                            {item.change > 0 ? (
                              <>
                                <ArrowUp className="h-4 w-4 mr-1" /> {item.change}%
                              </>
                            ) : item.change < 0 ? (
                              <>
                                <ArrowDown className="h-4 w-4 mr-1" /> {Math.abs(item.change)}%
                              </>
                            ) : (
                              <>0%</>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
