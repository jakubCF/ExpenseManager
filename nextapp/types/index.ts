export interface LineItem {
  name: string;
  price: number;
  quantity: number;
  discount: number;
  net_price: number;
  tax_ght_hst: number;
  included: boolean;
}

export interface Entry {
  id: number;
  created_at: string;
  store_name: string;
  store_address: string;
  store_phone: string;
  date_of_purchase: string;
  subtotal: number;
  gst: number;
  hst: number;
  total: number;
  total_discounts: number;
  payment_method: string;
  line_items: LineItem[] | { data: LineItem[] };
  file_name: string;
  approved: boolean;
}
