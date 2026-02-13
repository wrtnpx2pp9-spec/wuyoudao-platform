export interface DataSwitch {
  id: number;
  name: string;
  key: string;
  value: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: number;
  title: string;
  description: string;
  requirements: string;
  price?: number;
  status: 'pending' | 'accepted' | 'completed' | 'closed';
  review_status: 'pending' | 'approved' | 'rejected';
  payment_status: 'unpaid' | 'paid' | 'not_required' | 'refunded';
  publisher_id: number;
  publisher_username?: string;
  reviewer_id?: number;
  reviewed_at?: string;
  review_comment?: string;
  tags?: string[];
  is_public: boolean;
  is_pinned: boolean;
  image1?: string;
  image2?: string;
  image3?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRequirement {
  title: string;
  description: string;
  requirements: string;
  price?: number;
  tags?: string[];
  is_public?: boolean;
  is_pinned?: boolean;
  image1?: string;
  image2?: string;
  image3?: string;
}

export interface UpdateRequirement {
  title?: string;
  description?: string;
  requirements?: string;
  price?: number;
  status?: 'pending' | 'accepted' | 'completed' | 'closed';
  payment_status?: 'unpaid' | 'paid' | 'refunded';
  tags?: string[];
  is_public?: boolean;
  is_pinned?: boolean;
  image1?: string;
  image2?: string;
  image3?: string;
}

export interface RequirementsResponse {
  requirements: Requirement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Order {
  id: number;
  requirement_id: number;
  worker_id: number;
  publisher_id: number;
  reviewer_id?: number;
  worker_username?: string;
  publisher_username?: string;
  reviewer_username?: string;
  user_username?: string;
  requirement_title?: string;
  requirement_description?: string;
  status: 'pending' | 'reviewing' | 'completed' | 'cancelled' | 'rejected';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_amount?: number;
  payment_method?: string;
  payment_time?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order_id?: number;
  requirement_id?: number;
  user_id: number;
  amount: number;
  payment_method: 'alipay' | 'wechat';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transaction_id?: string;
  out_trade_no?: string;
  created_at: string;
  updated_at: string;
}

export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  account_info: string;
  account_type: 'alipay' | 'wechat' | 'bank';
  remark?: string;
  created_at: string;
  updated_at: string;
}

export interface Earning {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  type: 'commission' | 'penalty';
  status: 'pending' | 'settled' | 'cancelled';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: number;
  title: string;
  image_url: string;
  link_url: string;
  position: 'hero' | 'sidebar' | 'footer';
  is_active: boolean;
  sort_order: number;
  desktop_height: number;
  mobile_height: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_orders: number;
  completed_orders: number;
  total_earnings: number;
  available_balance: number;
  frozen_amount: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  is_email_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SearchKeyword {
  id: number;
  keyword: string;
  text?: string;
  icon_type?: string;
  color?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HomeConfig {
  id?: number;
  site_name: string;
  site_name_visible: boolean;
  hero_title: string;
  hero_title_visible: boolean;
  hero_subtitle: string;
  hero_subtitle_visible: boolean;
  footer_text?: string;
  footer_text_visible?: boolean;
  search_keywords: SearchKeyword[];
  terminal_text?: string;
  terminal_title?: string;
  created_at?: string;
  updated_at?: string;
}