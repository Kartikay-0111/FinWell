
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
import { AlertTriangle, Filter, MoreHorizontal, Calendar, ArrowUpDown, Plus, Upload, FileUp, X, Check, FileText } from "lucide-react";
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

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadResponse, setUploadResponse] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const addPdf = async () => {
    if (!pdfFile) {
      setUploadStatus('Please select a PDF file.')
      return
    }

    const formData = new FormData()
    formData.append('pdf_file', pdfFile)
    
    setUploadProgress(0)
    setUploadStatus('Uploading...')

    try {
      // Using XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          setUploadStatus('Upload successful!')
          setUploadResponse(data)
          setTimeout(() => setIsAddDialogOpen(false), 1000) // Close after showing success
        } else {
          let errorMessage = 'An error occurred.'
          try {
            const errorData = JSON.parse(xhr.responseText)
            errorMessage = errorData.error || errorMessage
          } catch (e) {}
          setUploadStatus(`Upload failed: ${errorMessage}`)
          setUploadProgress(0)
        }
      })

      xhr.addEventListener('error', () => {
        setUploadStatus('Upload failed: Network error')
        setUploadProgress(0)
      })

      xhr.open('POST', 'https://d475-103-104-226-58.ngrok-free.app/upload_pdf')
      xhr.send(formData)
    } catch (error: any) {
      setUploadStatus(`Upload failed: ${error.message}`)
      setUploadProgress(0)
      setUploadResponse({ error: error.message })
    }
  }
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
                  <SelectItem value="all">All Categories</SelectItem>
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

  
      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setPdfFile(null)
          setUploadStatus('')
          setUploadProgress(0)
        }
        setIsAddDialogOpen(open)
      }}>
      <DialogContent className="bg-finDarkBlue border border-finOrange/20 text-finWhite sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileUp className="h-5 w-5 text-finOrange" />
            Add Transaction
          </DialogTitle>
          <DialogDescription className="text-finLightGray">
            Upload a PDF statement to record a new transaction
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            addPdf()
          }}
          className="space-y-6"
        >
          <div 
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${isDragging ? 'border-finOrange bg-finOrange/10' : pdfFile ? 'border-green-500/50 bg-green-500/5' : 'border-finLightGray/30 hover:border-finLightGray/50'}`}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0]
                if (file.type === 'application/pdf') {
                  setPdfFile(file)
                  setUploadStatus('')
                } else {
                  setUploadStatus('Please select a PDF file.')
                }
              }
            }}
          >
            {!pdfFile ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="p-4 bg-finOrange/20 rounded-full">
                  <Upload className="h-8 w-8 text-finOrange" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-finWhite font-medium">Drag and drop your PDF file</h3>
                  <p className="text-finLightGray text-sm">or click to browse files</p>
                </div>
                <Label 
                  htmlFor="pdf-upload" 
                  className="cursor-pointer bg-finOrange/20 hover:bg-finOrange/30 text-finOrange px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Select PDF
                </Label>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPdfFile(e.target.files[0])
                      setUploadStatus('')
                    }
                  }}
                />
                <p className="text-xs text-finLightGray">Supported format: PDF</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <div className="p-3 bg-green-500/20 rounded-full">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-finWhite font-medium">File ready for upload</h3>
                  <p className="text-finLightGray text-sm flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" />
                    {pdfFile.name}
                  </p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-300 flex items-center gap-1"
                  onClick={() => {
                    setPdfFile(null)
                    setUploadStatus('')
                  }}
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
          </div>
          
          {uploadStatus && (
            <div className="space-y-2">
              <p className={`text-sm ${uploadStatus.includes('successful') ? 'text-green-400' : uploadStatus === 'Uploading...' ? 'text-blue-400' : 'text-yellow-300'} flex items-center gap-2`}>
                {uploadStatus.includes('successful') ? <Check className="h-4 w-4" /> : 
                 uploadStatus === 'Uploading...' ? <FileUp className="h-4 w-4 animate-pulse" /> : 
                 <AlertTriangle className="h-4 w-4" />}
                {uploadStatus}
              </p>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-finLightGray/20 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-finOrange h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-finLightGray/30 text-finLightGray hover:text-finWhite hover:border-finLightGray/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90 flex items-center gap-2"
              disabled={!pdfFile || uploadStatus === 'Uploading...'}
            >
              <FileUp className="h-4 w-4" />
              Upload PDF
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default Transactions;
