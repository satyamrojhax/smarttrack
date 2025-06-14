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
      chapters: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_index: number
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_index?: number
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      doubt_responses: {
        Row: {
          created_at: string | null
          doubt_id: string | null
          id: string
          is_ai_response: boolean | null
          response_text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          doubt_id?: string | null
          id?: string
          is_ai_response?: boolean | null
          response_text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          doubt_id?: string | null
          id?: string
          is_ai_response?: boolean | null
          response_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doubt_responses_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          },
        ]
      }
      doubts: {
        Row: {
          created_at: string | null
          description: string
          id: string
          status: string | null
          subject_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          subject_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          subject_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doubts_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          board: Database["public"]["Enums"]["board_type"]
          class: Database["public"]["Enums"]["class_level"]
          created_at: string | null
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          board: Database["public"]["Enums"]["board_type"]
          class: Database["public"]["Enums"]["class_level"]
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          board?: Database["public"]["Enums"]["board_type"]
          class?: Database["public"]["Enums"]["class_level"]
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      question_history: {
        Row: {
          correct_answer: string | null
          created_at: string
          difficulty_level: number | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          question_text: string
          question_type: string | null
          time_taken: number | null
          user_answer: string | null
          user_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          difficulty_level?: number | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          question_text: string
          question_type?: string | null
          time_taken?: number | null
          user_answer?: string | null
          user_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          difficulty_level?: number | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          question_text?: string
          question_type?: string | null
          time_taken?: number | null
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_history_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          chapter_id: string | null
          correct_answer: string | null
          created_at: string | null
          difficulty_level: number | null
          explanation: string | null
          id: string
          options: Json | null
          question_text: string
          question_type: string | null
        }
        Insert: {
          chapter_id?: string | null
          correct_answer?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question_text: string
          question_type?: string | null
        }
        Update: {
          chapter_id?: string | null
          correct_answer?: string | null
          created_at?: string | null
          difficulty_level?: number | null
          explanation?: string | null
          id?: string
          options?: Json | null
          question_text?: string
          question_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          board: Database["public"]["Enums"]["board_type"]
          class: Database["public"]["Enums"]["class_level"]
          color: string
          created_at: string | null
          icon: string
          id: string
          name: string
          subject_type: Database["public"]["Enums"]["subject_type"]
        }
        Insert: {
          board: Database["public"]["Enums"]["board_type"]
          class: Database["public"]["Enums"]["class_level"]
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          name: string
          subject_type: Database["public"]["Enums"]["subject_type"]
        }
        Update: {
          board?: Database["public"]["Enums"]["board_type"]
          class?: Database["public"]["Enums"]["class_level"]
          color?: string
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
          subject_type?: Database["public"]["Enums"]["subject_type"]
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          chapter_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
      board_type: "cbse" | "icse" | "state"
      class_level: "class-9" | "class-10" | "class-11" | "class-12"
      subject_type:
        | "mathematics"
        | "science"
        | "social-science"
        | "english-first-flight"
        | "english-footprints"
        | "hindi"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin"],
      board_type: ["cbse", "icse", "state"],
      class_level: ["class-9", "class-10", "class-11", "class-12"],
      subject_type: [
        "mathematics",
        "science",
        "social-science",
        "english-first-flight",
        "english-footprints",
        "hindi",
      ],
    },
  },
} as const
