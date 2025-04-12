
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Filter, MoreHorizontal, Calendar, ArrowUpDown, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  category: string | null;
  transaction_date: string;
  created_at: string;
  receiver_id: string | null;
  notes?: string;
};

const CATEGORIES = [
  "Food",
  "Shopping",
  "Transport",
  "Entertainment",
  "Housing",
  "Utilities",
  "Healthcare",
  "Education",
  "Subscriptions",
  "Income",
  "Groceries",
  "Others",
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Schema for transaction form validation
const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.string().min(1, "Transaction type is required"),
  category: z.string().min(1, "Category is required"),
  transaction_date: z.string().min(1, "Date is required"),
  receiver_id: z.string().optional(),
  notes: z.string().optional(),
});

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { toast } = useToast();

  // Form for adding new transactions
  const addForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: "debit",
      category: "",
      transaction_date: new Date().toISOString().split('T')[0],
      receiver_id: "",
      notes: "",
    },
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setTransactions(data);
        setFilteredTransactions(data);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...transactions];

    // Apply date range filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (t) => new Date(t.transaction_date) >= new Date(dateRange.start)
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(
        (t) => new Date(t.transaction_date) <= new Date(dateRange.end)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    // Apply amount range filter
    if (amountRange.min) {
      filtered = filtered.filter(
        (t) => t.amount >= Number(amountRange.min)
      );
    }
    
    if (amountRange.max) {
      filtered = filtered.filter(
        (t) => t.amount <= Number(amountRange.max)
      );
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.receiver_id && t.receiver_id.toLowerCase().includes(query)) ||
          (t.category && t.category.toLowerCase().includes(query)) ||
          (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    setFilteredTransactions(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setDateRange({ start: "", end: "" });
    setCategoryFilter("");
    setAmountRange({ min: "", max: "" });
    setSearchQuery("");
    setFilteredTransactions(transactions);
  };

  // Handle transaction update
  const handleTransactionUpdate = async () => {
    if (!selectedTransaction) return;
    
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          category: selectedTransaction.category,
          notes: selectedTransaction.notes,
        })
        .eq('id', selectedTransaction.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setTransactions(
        transactions.map((t) =>
          t.id === selectedTransaction.id ? selectedTransaction : t
        )
      );
      
      setFilteredTransactions(
        filteredTransactions.map((t) =>
          t.id === selectedTransaction.id ? selectedTransaction : t
        )
      );
      
      setIsEditDialogOpen(false);
      
      toast({
        title: "Transaction updated",
        description: "The transaction has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Handle adding new transaction
  const onAddTransaction = async (values: z.infer<typeof transactionSchema>) => {
    try {
      const newTransaction = {
        amount: values.amount,
        type: values.type,
        category: values.category,
        transaction_date: values.transaction_date,
        receiver_id: values.receiver_id || `${values.category.toLowerCase()}@example.com`,
        is_manual: true,
      };
      
      const { error, data } = await supabase
        .from('transactions')
        .insert([newTransaction])
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Transaction added",
        description: "The transaction has been successfully added.",
      });
      
      // Reset form
      addForm.reset();
      
      // Close dialog
      setIsAddDialogOpen(false);
      
      // Refresh transactions
      fetchTransactions();
      
    } catch (error: any) {
      toast({
        title: "Error adding transaction",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-finWhite">Transactions</h1>
          <p className="text-finLightGray">
            View, search, and categorize your transactions
          </p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card className="fin-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>Filters</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="border-finLightGray/20 text-finLightGray hover:text-finWhite hover:border-finLightGray/40"
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={applyFilters}
                className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
              >
                <Filter className="h-4 w-4 mr-1" /> Apply Filters
              </Button>
            </div>
          </div>
          <CardDescription className="text-finLightGray">
            Filter transactions by date, category, amount or search terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <Label htmlFor="date-start" className="text-finLightGray">
                <Calendar className="h-4 w-4 inline-block mr-1" /> Date Range
              </Label>
              <div className="flex items-center mt-1 space-x-2">
                <Input
                  id="date-start"
                  type="date"
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                />
                <span className="text-finLightGray">to</span>
                <Input
                  id="date-end"
                  type="date"
                  placeholder="End Date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category" className="text-finLightGray">
                Category
              </Label>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger
                  id="category"
                  className="mt-1 bg-finDarkBlue border-finLightGray/30 text-finWhite"
                >
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                  <SelectItem value="">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range Filter */}
            <div>
              <Label htmlFor="amount-min" className="text-finLightGray">
                <ArrowUpDown className="h-4 w-4 inline-block mr-1" /> Amount Range
              </Label>
              <div className="flex items-center mt-1 space-x-2">
                <Input
                  id="amount-min"
                  type="number"
                  placeholder="Min"
                  value={amountRange.min}
                  onChange={(e) =>
                    setAmountRange({ ...amountRange, min: e.target.value })
                  }
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                />
                <span className="text-finLightGray">to</span>
                <Input
                  id="amount-max"
                  type="number"
                  placeholder="Max"
                  value={amountRange.max}
                  onChange={(e) =>
                    setAmountRange({ ...amountRange, max: e.target.value })
                  }
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                />
              </div>
            </div>

            {/* Search Filter */}
            <div>
              <Label htmlFor="search" className="text-finLightGray">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 bg-finDarkBlue border-finLightGray/30 text-finWhite"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="fin-card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <div className="animate-spin h-8 w-8 border-4 border-finOrange border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-finDarkBlue/50">
                <TableRow>
                  <TableHead className="text-finLightGray">Date</TableHead>
                  <TableHead className="text-finLightGray">Recipient</TableHead>
                  <TableHead className="text-finLightGray">Type</TableHead>
                  <TableHead className="text-finLightGray">Amount</TableHead>
                  <TableHead className="text-finLightGray">Category</TableHead>
                  <TableHead className="text-finLightGray w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-finLightGray"
                    >
                      No transactions found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.receiver_id || "Unknown"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            transaction.type === "credit"
                              ? "bg-green-900/20 text-green-500"
                              : "bg-finOrange/10 text-finOrange"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {transaction.category ? (
                          <span className="inline-block px-2 py-1 bg-finDarkBlue rounded-full text-xs">
                            {transaction.category}
                          </span>
                        ) : (
                          <span className="flex items-center text-red-500">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Uncategorized
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-finLightGray hover:text-finWhite"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTransaction(transaction);
                                setIsEditDialogOpen(true);
                              }}
                              className="cursor-pointer hover:bg-finOrange/10"
                            >
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-finDarkBlue border border-finOrange/20 text-finWhite">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription className="text-finLightGray">
              Update category and add notes to this transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-date" className="text-finLightGray">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={selectedTransaction.transaction_date}
                    disabled
                    className="bg-finDarkBlue/50 border-finLightGray/30 text-finLightGray"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-amount" className="text-finLightGray">Amount</Label>
                  <Input
                    id="edit-amount"
                    type="text"
                    value={formatCurrency(selectedTransaction.amount)}
                    disabled
                    className="bg-finDarkBlue/50 border-finLightGray/30 text-finLightGray"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-recipient" className="text-finLightGray">Recipient</Label>
                <Input
                  id="edit-recipient"
                  value={selectedTransaction.receiver_id || "Unknown"}
                  disabled
                  className="bg-finDarkBlue/50 border-finLightGray/30 text-finLightGray"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category" className="text-finLightGray">Category</Label>
                <Select
                  value={selectedTransaction.category || ""}
                  onValueChange={(value) => {
                    setSelectedTransaction({
                      ...selectedTransaction,
                      category: value,
                    });
                  }}
                >
                  <SelectTrigger
                    id="edit-category"
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-notes" className="text-finLightGray">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Add notes about this transaction..."
                  value={selectedTransaction.notes || ""}
                  onChange={(e) => {
                    setSelectedTransaction({
                      ...selectedTransaction,
                      notes: e.target.value,
                    });
                  }}
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-finLightGray/30 text-finLightGray hover:text-finWhite hover:border-finLightGray/50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleTransactionUpdate}
              className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-finDarkBlue border border-finOrange/20 text-finWhite">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription className="text-finLightGray">
              Record a new transaction in your account
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddTransaction)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-finWhite">Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-finWhite">Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                          <SelectItem value="debit">Debit (Expense)</SelectItem>
                          <SelectItem value="credit">Credit (Income)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addForm.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-finWhite">Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-finWhite">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="receiver_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-finWhite">Recipient (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="grocery store, salary, etc."
                        className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={addForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-finWhite">Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add details about this transaction..."
                        className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-finLightGray/30 text-finLightGray hover:text-finWhite hover:border-finLightGray/50"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90">
                  Add Transaction
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
