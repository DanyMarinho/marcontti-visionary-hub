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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_ia_configs: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          schedule: Json
          tenant_id: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          schedule?: Json
          tenant_id: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          schedule?: Json
          tenant_id?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_ia_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_ia_logs: {
        Row: {
          action_taken: string | null
          client_id: string | null
          created_at: string
          error_message: string | null
          id: string
          received_message: string
          status: string
          tenant_id: string
        }
        Insert: {
          action_taken?: string | null
          client_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          received_message: string
          status: string
          tenant_id: string
        }
        Update: {
          action_taken?: string | null
          client_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          received_message?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_ia_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_ia_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          field_name: string | null
          id: string
          new_value: string | null
          old_value: string | null
          table_name: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          table_name: string
          tenant_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          table_name?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      card_history: {
        Row: {
          card_id: string
          created_at: string
          description: string | null
          event_type: string
          from_stage: string | null
          id: string
          tenant_id: string
          to_stage: string | null
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          description?: string | null
          event_type: string
          from_stage?: string | null
          id?: string
          tenant_id: string
          to_stage?: string | null
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          description?: string | null
          event_type?: string
          from_stage?: string | null
          id?: string
          tenant_id?: string
          to_stage?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_history_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "pipeline_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_tags: {
        Row: {
          client_id: string
          tag_id: string
        }
        Insert: {
          client_id: string
          tag_id: string
        }
        Update: {
          client_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_tags_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          last_interaction: string | null
          notes: string | null
          phone: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          last_interaction?: string | null
          notes?: string | null
          phone: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          last_interaction?: string | null
          notes?: string | null
          phone?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string
          id: string
          period_end: string
          period_start: string
          seller_id: string | null
          store_id: string | null
          target_value: number
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          period_end: string
          period_start: string
          seller_id?: string | null
          store_id?: string | null
          target_value: number
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          period_end?: string
          period_start?: string
          seller_id?: string | null
          store_id?: string | null
          target_value?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          tenant_id: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          tenant_id: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          tenant_id?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_cards: {
        Row: {
          client_id: string
          closed_at: string | null
          created_at: string
          estimated_value: number
          expected_close_date: string | null
          final_value: number | null
          id: string
          is_archived: boolean
          lost_reason: string | null
          notes: string | null
          seller_id: string
          stage_key: string
          store_id: string
          tenant_id: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          closed_at?: string | null
          created_at?: string
          estimated_value?: number
          expected_close_date?: string | null
          final_value?: number | null
          id?: string
          is_archived?: boolean
          lost_reason?: string | null
          notes?: string | null
          seller_id: string
          stage_key: string
          store_id: string
          tenant_id: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          closed_at?: string | null
          created_at?: string
          estimated_value?: number
          expected_close_date?: string | null
          final_value?: number | null
          id?: string
          is_archived?: boolean
          lost_reason?: string | null
          notes?: string | null
          seller_id?: string
          stage_key?: string
          store_id?: string
          tenant_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_cards_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_cards_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_cards_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_cards_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_stages: {
        Row: {
          id: string
          label: string
          position: number
          stage_key: string
          tenant_id: string
        }
        Insert: {
          id?: string
          label: string
          position: number
          stage_key: string
          tenant_id: string
        }
        Update: {
          id?: string
          label?: string
          position?: number
          stage_key?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      reactivation_logs: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          notes: string | null
          result: string | null
          stage_at_time: string | null
          tenant_id: string
          type: string
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          stage_at_time?: string | null
          tenant_id: string
          type: string
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          stage_at_time?: string | null
          tenant_id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reactivation_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactivation_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          manager: string | null
          name: string
          phone: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          manager?: string | null
          name: string
          phone?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          manager?: string | null
          name?: string
          phone?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          tenant_id: string
        }
        Insert: {
          id?: string
          name: string
          tenant_id: string
        }
        Update: {
          id?: string
          name?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          cnpj: string | null
          color: string | null
          contact_email: string
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          niche: string
          no_response_threshold_minutes: number | null
          owner_name: string | null
          plan: string | null
          reactivation_auto_enabled: boolean | null
          reactivation_idle_days: number | null
          reactivation_interval_days: number | null
          reactivation_max_attempts: number | null
          reactivation_messages: Json | null
          status: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          color?: string | null
          contact_email: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          niche: string
          no_response_threshold_minutes?: number | null
          owner_name?: string | null
          plan?: string | null
          reactivation_auto_enabled?: boolean | null
          reactivation_idle_days?: number | null
          reactivation_interval_days?: number | null
          reactivation_max_attempts?: number | null
          reactivation_messages?: Json | null
          status?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          color?: string | null
          contact_email?: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          niche?: string
          no_response_threshold_minutes?: number | null
          owner_name?: string | null
          plan?: string | null
          reactivation_auto_enabled?: boolean | null
          reactivation_idle_days?: number | null
          reactivation_interval_days?: number | null
          reactivation_max_attempts?: number | null
          reactivation_messages?: Json | null
          status?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: string
          store_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          phone?: string | null
          role: string
          store_id?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string
          store_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          ai_enabled: boolean
          assigned_to: string | null
          client_id: string
          created_at: string | null
          id: string
          last_activity_at: string | null
          last_message_direction: string | null
          status: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          ai_enabled?: boolean
          assigned_to?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_message_direction?: string | null
          status?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          ai_enabled?: boolean
          assigned_to?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_message_direction?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          api_key: string
          created_at: string
          evolution_url: string
          id: string
          instance_name: string
          phone_number: string | null
          status: string
          tenant_id: string
          updated_at: string
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          created_at?: string
          evolution_url: string
          id?: string
          instance_name: string
          phone_number?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string
          evolution_url?: string
          id?: string
          instance_name?: string
          phone_number?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          client_id: string
          content: string
          direction: string
          external_id: string | null
          id: string
          processed_by_ai: boolean
          tenant_id: string
          timestamp: string
        }
        Insert: {
          client_id: string
          content: string
          direction: string
          external_id?: string | null
          id?: string
          processed_by_ai?: boolean
          tenant_id: string
          timestamp?: string
        }
        Update: {
          client_id?: string
          content?: string
          direction?: string
          external_id?: string | null
          id?: string
          processed_by_ai?: boolean
          tenant_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_role: { Args: never; Returns: string }
      user_tenant_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
