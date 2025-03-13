export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advances: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string | null
          deduction_date: string | null
          employee_id: string | null
          expected_payment_date: string
          id: string
          is_deducted: boolean | null
          notes: string | null
          payment_date: string | null
          payroll_id: string | null
          remaining_amount: number | null
          request_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string | null
          deduction_date?: string | null
          employee_id?: string | null
          expected_payment_date: string
          id?: string
          is_deducted?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payroll_id?: string | null
          remaining_amount?: number | null
          request_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string | null
          deduction_date?: string | null
          employee_id?: string | null
          expected_payment_date?: string
          id?: string
          is_deducted?: boolean | null
          notes?: string | null
          payment_date?: string | null
          payroll_id?: string | null
          remaining_amount?: number | null
          request_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string | null
          work_hours: number | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status: string
          updated_at?: string | null
          work_hours?: number | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
          work_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          base_salary: number
          created_at: string | null
          daily_rate: number | null
          daily_rate_with_incentive: number | null
          department: string
          id: string
          join_date: string
          monthly_incentives: number | null
          name: string
          overtime_rate: number | null
          position: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_salary: number
          created_at?: string | null
          daily_rate?: number | null
          daily_rate_with_incentive?: number | null
          department: string
          id?: string
          join_date: string
          monthly_incentives?: number | null
          name: string
          overtime_rate?: number | null
          position: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_salary?: number
          created_at?: string | null
          daily_rate?: number | null
          daily_rate_with_incentive?: number | null
          department?: string
          id?: string
          join_date?: string
          monthly_incentives?: number | null
          name?: string
          overtime_rate?: number | null
          position?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      incentives: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          distribution_date: string | null
          employee_id: string | null
          id: string
          reason: string | null
          sold_items: number | null
          status: string | null
          type: string
          updated_at: string | null
          yearly_days: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          distribution_date?: string | null
          employee_id?: string | null
          id?: string
          reason?: string | null
          sold_items?: number | null
          status?: string | null
          type: string
          updated_at?: string | null
          yearly_days?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          distribution_date?: string | null
          employee_id?: string | null
          id?: string
          reason?: string | null
          sold_items?: number | null
          status?: string | null
          type?: string
          updated_at?: string | null
          yearly_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "incentives_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          created_at: string | null
          employee_id: string | null
          end_date: string
          id: string
          leave_type: string
          notes: string | null
          reason: string | null
          start_date: string
          status: string | null
          total_days: number
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type: string
          notes?: string | null
          reason?: string | null
          start_date: string
          status?: string | null
          total_days: number
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: string
          notes?: string | null
          reason?: string | null
          start_date?: string
          status?: string | null
          total_days?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          absence_days: number | null
          absence_deductions: number | null
          advances: number | null
          base_salary: number
          bonus: number | null
          created_at: string | null
          employee_id: string | null
          id: string
          month: number
          monthly_incentives: number | null
          net_salary: number
          overtime_amount: number | null
          overtime_hours: number | null
          penalties: number | null
          penalty_days: number | null
          purchases: number | null
          status: string | null
          total_salary_with_incentive: number
          updated_at: string | null
          year: number
        }
        Insert: {
          absence_days?: number | null
          absence_deductions?: number | null
          advances?: number | null
          base_salary: number
          bonus?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          month: number
          monthly_incentives?: number | null
          net_salary: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          penalties?: number | null
          penalty_days?: number | null
          purchases?: number | null
          status?: string | null
          total_salary_with_incentive: number
          updated_at?: string | null
          year: number
        }
        Update: {
          absence_days?: number | null
          absence_deductions?: number | null
          advances?: number | null
          base_salary?: number
          bonus?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          month?: number
          monthly_incentives?: number | null
          net_salary?: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          penalties?: number | null
          penalty_days?: number | null
          purchases?: number | null
          status?: string | null
          total_salary_with_incentive?: number
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          absence_deductions_formula: string | null
          company_logo: string | null
          company_name: string
          created_at: string | null
          currency: string | null
          daily_rate_formula: string | null
          daily_rate_with_incentive_formula: string | null
          default_language: string | null
          enable_rtl: boolean | null
          id: string
          max_advance_limit_formula: string | null
          net_salary_formula: string | null
          overtime_rate_formula: string | null
          penalties_formula: string | null
          total_salary_with_incentive_formula: string | null
          updated_at: string | null
          working_days_per_month: number | null
          working_hours_per_day: number | null
        }
        Insert: {
          absence_deductions_formula?: string | null
          company_logo?: string | null
          company_name?: string
          created_at?: string | null
          currency?: string | null
          daily_rate_formula?: string | null
          daily_rate_with_incentive_formula?: string | null
          default_language?: string | null
          enable_rtl?: boolean | null
          id?: string
          max_advance_limit_formula?: string | null
          net_salary_formula?: string | null
          overtime_rate_formula?: string | null
          penalties_formula?: string | null
          total_salary_with_incentive_formula?: string | null
          updated_at?: string | null
          working_days_per_month?: number | null
          working_hours_per_day?: number | null
        }
        Update: {
          absence_deductions_formula?: string | null
          company_logo?: string | null
          company_name?: string
          created_at?: string | null
          currency?: string | null
          daily_rate_formula?: string | null
          daily_rate_with_incentive_formula?: string | null
          default_language?: string | null
          enable_rtl?: boolean | null
          id?: string
          max_advance_limit_formula?: string | null
          net_salary_formula?: string | null
          overtime_rate_formula?: string | null
          penalties_formula?: string | null
          total_salary_with_incentive_formula?: string | null
          updated_at?: string | null
          working_days_per_month?: number | null
          working_hours_per_day?: number | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
