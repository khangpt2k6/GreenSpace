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
      comments: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_name: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          author_name?: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          author_name: string
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          product_url: string | null
          rating: number | null
          resale: boolean | null
          sustainability: number | null
          user_id: string
        }
        Insert: {
          author_name?: string
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          product_url?: string | null
          rating?: number | null
          resale?: boolean | null
          sustainability?: number | null
          user_id: string
        }
        Update: {
          author_name?: string
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          product_url?: string | null
          rating?: number | null
          resale?: boolean | null
          sustainability?: number | null
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
  }
}
