export type Database = {
  public: {
    Tables: {
      goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          description: string | null
          id: string
          is_completed: boolean | null
          target_amount: number
          target_date: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          target_amount: number
          target_date?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          target_amount?: number
          target_date?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          id: string
          is_manual: boolean | null
          receiver_id: string | null
          transaction_date: string
          transaction_id: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          id?: string
          is_manual?: boolean | null
          receiver_id?: string | null
          transaction_date: string
          transaction_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          id?: string
          is_manual?: boolean | null
          receiver_id?: string | null
          transaction_date?: string
          transaction_id?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          dob: string | null
          id: string
          income: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          dob?: string | null
          id?: string
          income: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          dob?: string | null
          id?: string
          income?: number
          name?: string | null
        }
        Relationships: []
      }
      upi_transactions: {
        Row: {
          UPI_ID: string
          Date: string
          Credit: string | null
          Debit: string | null
          Balance: string | null
          Mode: string | null
          To_Name: string | null
          To_Bank: string | null
          To_Upi_Id: string | null
          Category: string | null
          Score: number | null
          Timestamp: string | null
        }
        Insert: {
          UPI_ID: string
          Date: string
          Credit?: string | null
          Debit?: string | null
          Balance?: string | null
          Mode?: string | null
          To_Name?: string | null
          To_Bank?: string | null
          To_Upi_Id?: string | null
          Category?: string | null
          Score?: number | null
          Timestamp?: string | null
        }
        Update: {
          UPI_ID?: string
          Date?: string
          Credit?: string | null
          Debit?: string | null
          Balance?: string | null
          Mode?: string | null
          To_Name?: string | null
          To_Bank?: string | null
          To_Upi_Id?: string | null
          Category?: string | null
          Score?: number | null
          Timestamp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
