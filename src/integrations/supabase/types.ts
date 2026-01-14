export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          id: string
          provider: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          provider: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      hour_tasks: {
        Row: {
          context: string | null
          correct_answer: string | null
          created_at: string
          explanation: string | null
          hints: Json | null
          hour_number: number
          id: string
          options: Json | null
          question: string
          skill_focus: string[] | null
          task_order: number
          task_type: string
          updated_at: string
          week_number: number
          word_limit: number | null
        }
        Insert: {
          context?: string | null
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          hints?: Json | null
          hour_number: number
          id?: string
          options?: Json | null
          question: string
          skill_focus?: string[] | null
          task_order?: number
          task_type: string
          updated_at?: string
          week_number: number
          word_limit?: number | null
        }
        Update: {
          context?: string | null
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          hints?: Json | null
          hour_number?: number
          id?: string
          options?: Json | null
          question?: string
          skill_focus?: string[] | null
          task_order?: number
          task_type?: string
          updated_at?: string
          week_number?: number
          word_limit?: number | null
        }
        Relationships: []
      }
      lecture_section_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          hour_number: number
          id: string
          key_takeaway_viewed: boolean | null
          notes: string | null
          section_id: string
          section_index: number
          student_id: string
          visited_at: string | null
          week_number: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          hour_number: number
          id?: string
          key_takeaway_viewed?: boolean | null
          notes?: string | null
          section_id: string
          section_index?: number
          student_id: string
          visited_at?: string | null
          week_number: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          hour_number?: number
          id?: string
          key_takeaway_viewed?: boolean | null
          notes?: string | null
          section_id?: string
          section_index?: number
          student_id?: string
          visited_at?: string | null
          week_number?: number
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          ai_feedback: Json | null
          completed_at: string | null
          created_at: string
          fill_blank_answers: Json | null
          id: string
          lesson_id: string
          mc_answers: Json | null
          notes: string | null
          open_ended_responses: Json | null
          profile_id: string
          reflection: string | null
          section_completed: Json | null
          updated_at: string
        }
        Insert: {
          ai_feedback?: Json | null
          completed_at?: string | null
          created_at?: string
          fill_blank_answers?: Json | null
          id?: string
          lesson_id: string
          mc_answers?: Json | null
          notes?: string | null
          open_ended_responses?: Json | null
          profile_id: string
          reflection?: string | null
          section_completed?: Json | null
          updated_at?: string
        }
        Update: {
          ai_feedback?: Json | null
          completed_at?: string | null
          created_at?: string
          fill_blank_answers?: Json | null
          id?: string
          lesson_id?: string
          mc_answers?: Json | null
          notes?: string | null
          open_ended_responses?: Json | null
          profile_id?: string
          reflection?: string | null
          section_completed?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key_concepts: Json | null
          lesson_number: number
          objectives: Json | null
          title: string
          updated_at: string
          week_id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key_concepts?: Json | null
          lesson_number: number
          objectives?: Json | null
          title: string
          updated_at?: string
          week_id: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key_concepts?: Json | null
          lesson_number?: number
          objectives?: Json | null
          title?: string
          updated_at?: string
          week_id?: number
        }
        Relationships: []
      }
      live_sessions: {
        Row: {
          allow_ahead: boolean | null
          completed_sections: Json | null
          created_at: string
          current_agenda_index: number | null
          current_question_index: number | null
          current_section: string | null
          ended_at: string | null
          id: string
          lesson_id: string
          section_started_at: string | null
          session_code: string
          session_type: string | null
          settings: Json | null
          started_at: string | null
          status: string
          teacher_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          allow_ahead?: boolean | null
          completed_sections?: Json | null
          created_at?: string
          current_agenda_index?: number | null
          current_question_index?: number | null
          current_section?: string | null
          ended_at?: string | null
          id?: string
          lesson_id: string
          section_started_at?: string | null
          session_code: string
          session_type?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          teacher_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          allow_ahead?: boolean | null
          completed_sections?: Json | null
          created_at?: string
          current_agenda_index?: number | null
          current_question_index?: number | null
          current_section?: string | null
          ended_at?: string | null
          id?: string
          lesson_id?: string
          section_started_at?: string | null
          session_code?: string
          session_type?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: string
          teacher_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      paragraph_notes: {
        Row: {
          created_at: string
          id: string
          notes: string
          paragraph_key: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          paragraph_key: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          paragraph_key?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      process_logs: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          message: string
          operation: string
          session_id: string | null
          status: string
          step: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          message: string
          operation: string
          session_id?: string | null
          status?: string
          step: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          message?: string
          operation?: string
          session_id?: string | null
          status?: string
          step?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          hkbu_user_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          hkbu_user_id: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          hkbu_user_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      session_participants: {
        Row: {
          current_section: string | null
          display_name: string | null
          id: string
          is_online: boolean | null
          joined_at: string
          last_seen_at: string | null
          session_id: string
          student_identifier: string
        }
        Insert: {
          current_section?: string | null
          display_name?: string | null
          id?: string
          is_online?: boolean | null
          joined_at?: string
          last_seen_at?: string | null
          session_id: string
          student_identifier: string
        }
        Update: {
          current_section?: string | null
          display_name?: string | null
          id?: string
          is_online?: boolean | null
          joined_at?: string
          last_seen_at?: string | null
          session_id?: string
          student_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_prompts: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          prompt_type: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt_type?: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_prompts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_responses: {
        Row: {
          ai_feedback: string | null
          id: string
          is_correct: boolean | null
          participant_id: string
          question_index: number
          question_type: string
          response: Json
          session_id: string
          submitted_at: string
        }
        Insert: {
          ai_feedback?: string | null
          id?: string
          is_correct?: boolean | null
          participant_id: string
          question_index: number
          question_type: string
          response: Json
          session_id: string
          submitted_at?: string
        }
        Update: {
          ai_feedback?: string | null
          id?: string
          is_correct?: boolean | null
          participant_id?: string
          question_index?: number
          question_type?: string
          response?: Json
          session_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "session_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_comments: {
        Row: {
          author_name: string | null
          content: string
          created_at: string
          id: string
          thread_id: string
        }
        Insert: {
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          thread_id: string
        }
        Update: {
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "staff_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_library_files: {
        Row: {
          created_at: string
          filename: string
          folder_id: string | null
          id: string
          is_archived: boolean
          markdown_content: string | null
          original_content: string | null
          thread_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          filename: string
          folder_id?: string | null
          id?: string
          is_archived?: boolean
          markdown_content?: string | null
          original_content?: string | null
          thread_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          filename?: string
          folder_id?: string | null
          id?: string
          is_archived?: boolean
          markdown_content?: string | null
          original_content?: string | null
          thread_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_library_files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "staff_library_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_library_files_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "staff_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_library_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_library_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "staff_library_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_materials: {
        Row: {
          created_at: string
          id: string
          markdown_content: string | null
          original_content: string | null
          thread_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          markdown_content?: string | null
          original_content?: string | null
          thread_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          markdown_content?: string | null
          original_content?: string | null
          thread_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_materials_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "staff_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_threads: {
        Row: {
          created_at: string
          decided_summary: string | null
          description: string | null
          id: string
          is_decided: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          decided_summary?: string | null
          description?: string | null
          id?: string
          is_decided?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          decided_summary?: string | null
          description?: string | null
          id?: string
          is_decided?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_api_usage: {
        Row: {
          created_at: string
          id: string
          request_count: number
          student_id: string
          updated_at: string
          usage_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_count?: number
          student_id: string
          updated_at?: string
          usage_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          request_count?: number
          student_id?: string
          updated_at?: string
          usage_date?: string
        }
        Relationships: []
      }
      student_id_merges: {
        Row: {
          created_at: string
          id: string
          merged_by: string
          merged_student_id: string
          primary_student_id: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          merged_by: string
          merged_student_id: string
          primary_student_id: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          merged_by?: string
          merged_student_id?: string
          primary_student_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_id_merges_merged_by_fkey"
            columns: ["merged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_questions: {
        Row: {
          context: string | null
          created_at: string
          hour_number: number | null
          id: string
          question: string
          responded_at: string | null
          responded_by: string | null
          status: string
          student_id: string
          teacher_response: string | null
          week_number: number
        }
        Insert: {
          context?: string | null
          created_at?: string
          hour_number?: number | null
          id?: string
          question: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          student_id: string
          teacher_response?: string | null
          week_number: number
        }
        Update: {
          context?: string | null
          created_at?: string
          hour_number?: number | null
          id?: string
          question?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          student_id?: string
          teacher_response?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_questions_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_sessions: {
        Row: {
          activity_data: Json
          ai_interactions: Json
          ai_report: Json | null
          browser_session_id: string
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          lesson_id: string | null
          module_name: string | null
          report_code: string | null
          student_id: string | null
        }
        Insert: {
          activity_data?: Json
          ai_interactions?: Json
          ai_report?: Json | null
          browser_session_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lesson_id?: string | null
          module_name?: string | null
          report_code?: string | null
          student_id?: string | null
        }
        Update: {
          activity_data?: Json
          ai_interactions?: Json
          ai_report?: Json | null
          browser_session_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          lesson_id?: string | null
          module_name?: string | null
          report_code?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_task_responses: {
        Row: {
          ai_feedback: string | null
          id: string
          is_correct: boolean | null
          question_key: string | null
          response: string
          score: number | null
          student_id: string
          submitted_at: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          ai_feedback?: string | null
          id?: string
          is_correct?: boolean | null
          question_key?: string | null
          response: string
          score?: number | null
          student_id: string
          submitted_at?: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          ai_feedback?: string | null
          id?: string
          is_correct?: boolean | null
          question_key?: string | null
          response?: string
          score?: number | null
          student_id?: string
          submitted_at?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_task_responses_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hour_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_active: boolean
          notes: string | null
          student_id: string
          student_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          student_id: string
          student_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          student_id?: string
          student_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      task_feedback: {
        Row: {
          comment: string
          created_at: string
          id: string
          response_id: string | null
          student_id: string
          task_key: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          response_id?: string | null
          student_id: string
          task_key: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          response_id?: string | null
          student_id?: string
          task_key?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_feedback_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          session_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          session_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          session_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_comments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "student_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_comments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_student_notes: {
        Row: {
          created_at: string
          id: string
          notes: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_student_notes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          profile_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          profile_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      writing_drafts: {
        Row: {
          ai_feedback: string | null
          content: string
          created_at: string
          id: string
          is_submitted: boolean
          student_id: string
          task_key: string
          updated_at: string
          version: number
        }
        Insert: {
          ai_feedback?: string | null
          content: string
          created_at?: string
          id?: string
          is_submitted?: boolean
          student_id: string
          task_key: string
          updated_at?: string
          version?: number
        }
        Update: {
          ai_feedback?: string | null
          content?: string
          created_at?: string
          id?: string
          is_submitted?: boolean
          student_id?: string
          task_key?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_session_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _profile_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "teacher" | "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["teacher", "student", "admin"],
    },
  },
} as const
