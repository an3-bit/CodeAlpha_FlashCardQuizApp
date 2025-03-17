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
      flashcards: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          id: string
          last_reviewed: string | null
          question: string
          times_correct: number | null
          times_reviewed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string | null
          id?: string
          last_reviewed?: string | null
          question: string
          times_correct?: number | null
          times_reviewed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          id?: string
          last_reviewed?: string | null
          question?: string
          times_correct?: number | null
          times_reviewed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          category: string
          correct_answers: number
          date: string | null
          id: string
          time_spent: number
          total_questions: number
          user_id: string
        }
        Insert: {
          category: string
          correct_answers: number
          date?: string | null
          id?: string
          time_spent: number
          total_questions: number
          user_id: string
        }
        Update: {
          category?: string
          correct_answers?: number
          date?: string | null
          id?: string
          time_spent?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      shared_deck_flashcards: {
        Row: {
          deck_id: string
          flashcard_id: string
          id: string
        }
        Insert: {
          deck_id: string
          flashcard_id: string
          id?: string
        }
        Update: {
          deck_id?: string
          flashcard_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_deck_flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "shared_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_deck_flashcards_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_decks: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      study_metrics: {
        Row: {
          average_accuracy: number | null
          cards_reviewed: number | null
          category: string
          created_at: string | null
          id: string
          last_study_date: string | null
          total_study_time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_accuracy?: number | null
          cards_reviewed?: number | null
          category: string
          created_at?: string | null
          id?: string
          last_study_date?: string | null
          total_study_time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_accuracy?: number | null
          cards_reviewed?: number | null
          category?: string
          created_at?: string | null
          id?: string
          last_study_date?: string | null
          total_study_time?: number | null
          updated_at?: string | null
          user_id?: string
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
