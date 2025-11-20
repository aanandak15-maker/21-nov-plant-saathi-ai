import type { CartItem, Cart } from './types';
import { supabase } from '../supabase';

class CartService {
  private storageKey = 'plant_saathi_cart';
  private syncTimeout: NodeJS.Timeout | null = null;

  getCart(): Cart {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        return { items: [], total: 0, itemCount: 0 };
      }
    }
    return { items: [], total: 0, itemCount: 0 };
  }

  // Load cart from Supabase (for logged-in users)
  async loadCartFromSupabase(): Promise<Cart> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getCart();

      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_data')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.log('No cart found in Supabase, using local cart');
        return this.getCart();
      }

      if (data && data.cart_data) {
        const cart = data.cart_data as Cart;
        this.saveCart(cart, false); // Save to localStorage without syncing back
        return cart;
      }
    } catch (error) {
      console.error('Failed to load cart from Supabase:', error);
    }
    
    return this.getCart();
  }

  addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
    const cart = this.getCart();
    
    // Check if item already exists
    const existingIndex = cart.items.findIndex(i => i.product_id === item.product_id);
    
    if (existingIndex >= 0) {
      // Update quantity
      cart.items[existingIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ ...item, quantity });
    }
    
    this.updateCartTotals(cart);
    this.saveCart(cart);
    return cart;
  }

  updateQuantity(productId: string, quantity: number): Cart {
    const cart = this.getCart();
    const item = cart.items.find(i => i.product_id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      this.updateCartTotals(cart);
      this.saveCart(cart);
    }
    
    return cart;
  }

  removeFromCart(productId: string): Cart {
    const cart = this.getCart();
    cart.items = cart.items.filter(i => i.product_id !== productId);
    this.updateCartTotals(cart);
    this.saveCart(cart);
    return cart;
  }

  clearCart(): Cart {
    const cart: Cart = { items: [], total: 0, itemCount: 0 };
    this.saveCart(cart);
    return cart;
  }

  private updateCartTotals(cart: Cart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  private saveCart(cart: Cart, syncToSupabase: boolean = true): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    // Dispatch event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    
    // Sync to Supabase with debouncing (for logged-in users)
    if (syncToSupabase) {
      if (this.syncTimeout) {
        clearTimeout(this.syncTimeout);
      }
      this.syncTimeout = setTimeout(() => {
        this.syncCartToSupabase(cart);
      }, 1000); // Debounce for 1 second
    }
  }

  // Sync cart to Supabase (background operation, doesn't block UI)
  private async syncCartToSupabase(cart: Cart): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_carts')
        .upsert({
          user_id: user.id,
          cart_data: cart,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Failed to sync cart to Supabase:', error);
      } else {
        console.log('✅ Cart synced to Supabase');
      }
    } catch (error) {
      console.error('Failed to sync cart to Supabase:', error);
    }
  }

  // Generate bulk order Amazon links
  generateBulkOrderLinks(): string[] {
    const cart = this.getCart();
    return cart.items.map(item => item.amazon_link);
  }

  // Generate bulk order text for sharing
  generateBulkOrderText(): string {
    const cart = this.getCart();
    let text = '🛒 Plant Saathi Bulk Order\n\n';
    
    cart.items.forEach((item, index) => {
      text += `${index + 1}. ${item.product_name}\n`;
      text += `   Quantity: ${item.quantity}\n`;
      text += `   Price: ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
      text += `   Link: ${item.amazon_link}\n\n`;
    });
    
    text += `Total Items: ${cart.itemCount}\n`;
    text += `Total Amount: ₹${cart.total.toFixed(2)}`;
    
    return text;
  }
}

export const cartService = new CartService();
