
export enum OrderStatus {
  PLACED = 'Order Placed',
  COOKING = 'Cooking',
  READY = 'Ready',
  CANCELLED = 'Cancelled',
  DELIVERED = 'Delivered'
}

export type FoodCategory = 'morning' | 'afternoon';

export interface StudentProfile {
  name: string;
  dept: string;
  year: string;
  college: string;
  contact: string;
  attendancePercentage?: number; // Added attendance percentage to profile
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string; // Image is now optional/can be empty
  description: string;
  category: FoodCategory;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'sms' | 'info';
  timestamp: Date;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number; // This is now the final price after discount
  originalTotalPrice?: number; // Original total before any discount
  appliedDiscountPercentage?: number; // Percentage discount applied
  status: OrderStatus;
  aiSuggestion?: string;
  timestamp: Date;
  instructions?: string;
  estimatedTime?: number;
  phoneNumber?: string;
  studentName?: string;
  studentDept?: string;
  feedbackSubmitted?: boolean; // New flag to track if feedback has been given
}

export interface Feedback {
  id: string;
  orderId?: string; // Optional: can be general feedback
  studentName: string;
  studentDept: string;
  rating: number; // 1-5 stars
  comment: string;
  timestamp: Date;
}

export type View = 'student' | 'admin';