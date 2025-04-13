import { supabase } from "@/integrations/supabase/client";

export const fetchTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching transactions:", error.message);
    throw new Error(error.message);
  }
};
