
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Filter, MoreHorizontal, Calendar, ArrowUpDown } from "lucide-react";
import { mockDataService, Transaction } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

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

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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

  useEffect(() => {
    // Fetch transactions
    const data = mockDataService.getTransactions();
    setTransactions(data);
    setFilteredTransactions(data);
  }, []);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...transactions];

    // Apply date range filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (t) => new Date(t.date) >= new Date(dateRange.start)
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(
        (t) => new Date(t.date) <= new Date(dateRange.end)
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
          t.recipient.toLowerCase().includes(query) ||
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
  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    
    setTransactions(updatedTransactions);
    setFilteredTransactions(
      filteredTransactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Transaction updated",
      description: "The transaction has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-finWhite">Transactions</h1>
        <p className="text-finLightGray">
          View, search, and categorize your transactions
        </p>
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
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.recipient}</TableCell>
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
                    value={selectedTransaction.date}
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
                  value={selectedTransaction.recipient}
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
              onClick={() => selectedTransaction && handleTransactionUpdate(selectedTransaction)}
              className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
