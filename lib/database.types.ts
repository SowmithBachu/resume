export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          google_id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          google_id: string;
          email: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          google_id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          data: any | null; // JSONB - stores all portfolio data
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          data?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          data?: any | null;
          created_at?: string;
        };
      };
    };
  };
}

