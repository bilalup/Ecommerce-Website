import { create } from "zustand";
import { persist } from 'zustand/middleware';
import axios from "axios";

const serverApi = import.meta.env.VITE_SERVER_API;
axios.defaults.withCredentials = true;

// Configure axios interceptors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      return Promise.reject({ ...error, silent: true });
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create(persist(
  (set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    error: null,
    isLoading: false,
    isCheckingAuth: false,

    // Actions
    initializeAuth: async () => {
      try {
        set({ isCheckingAuth: true, error: null });
        
        const [authCheck, adminCheck] = await Promise.all([
          axios.get(`${serverApi}/auth/checkAuth`).catch(() => ({ data: { isAuthenticated: false }})),
          get().isAuthenticated ? axios.get(`${serverApi}/auth/checkAdminAuth`).catch(() => ({ data: { isAdmin: false }})) : Promise.resolve({ data: { isAdmin: false }})
        ]);

        set({
          user: authCheck.data.user || null,
          isAuthenticated: authCheck.data.isAuthenticated || false,
          isAdmin: adminCheck.data.isAdmin || false,
          isCheckingAuth: false
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isCheckingAuth: false,
          error: error.message || 'Failed to initialize authentication'
        });
      }
    },

    signup: async (name, email, password) => {
      try {
        set({ isLoading: true, error: null });
        
        const response = await axios.post(`${serverApi}/auth/signup`, { 
          name, 
          email, 
          password 
        });

        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          isAdmin: response.data.user?.isAdmin || false,
          isLoading: false
        });

        return response.data;
      } catch (error) {
        console.error('Signup error:', error);
        set({ 
          error: error.response?.data?.message || error.message || 'Signup failed',
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false
        });
        throw error;
      }
    },

    login: async (email, password) => {
      try {
        set({ isLoading: true, error: null });
        
        const response = await axios.post(`${serverApi}/auth/login`, {
          email: email.trim(),
          password: password.trim()
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          isAdmin: response.data.user?.isAdmin || false,
          isLoading: false
        });

        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        set({ 
          error: error.response?.data?.message || error.message || 'Login failed',
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        set({ isLoading: true });
        
        await axios.post(`${serverApi}/auth/logout`);

        set({ 
          user: null, 
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Logout error:', error);
        set({ 
          error: error.response?.data?.message || error.message || 'Logout failed',
          isLoading: false
        });
      }
    },

    checkAdminAuth: async () => {
      try {
        if (!get().isAuthenticated) return false;
        
        const response = await axios.get(`${serverApi}/auth/checkAdminAuth`);
        
        set({ isAdmin: response.data.isAdmin });
        return response.data.isAdmin;
      } catch (error) {
        console.error('Admin check error:', error);
        set({ isAdmin: false });
        return false;
      }
    }
  }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isAdmin: state.isAdmin
    })
  }
));

// Product Store (unchanged)
export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  categories: ['t-shirts', 'jeans', 'shoes'],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${serverApi}/products/getAllProducts`);
      set({ 
        products: response.data.products || [],
        featuredProducts: response.data.products?.filter(p => p.isFeatured) || [],
        loading: false 
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         (error.code === 'ERR_NETWORK' ? 'Cannot connect to server' : 'Failed to fetch products');
      set({ 
        error: errorMessage,
        loading: false 
      });
      console.error('Product fetch error:', error);
    }
  }
}));

// Cart Store (unchanged)
export const useCartStore = create(persist((set, get) => ({
  items: [],
  total: 0,
  
  addToCart: (product) => {
    const existingItem = get().items.find(item => item._id === product._id);
    if (existingItem) {
      set(state => ({
        items: state.items.map(item => 
          item._id === product._id 
            ? {...item, quantity: item.quantity + 1} 
            : item
        )
      }));
    } else {
      set(state => ({ items: [...state.items, {...product, quantity: 1}] }));
    }
    get().calculateTotal();
  },
  
  removeFromCart: (id) => {
    set(state => ({ items: state.items.filter(item => item._id !== id) }));
    get().calculateTotal();
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(id);
      return;
    }
    set(state => ({
      items: state.items.map(item => 
        item._id === id ? {...item, quantity} : item
      )
    }));
    get().calculateTotal();
  },
  
  calculateTotal: () => {
    const total = get().items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    set({ total });
  },
  
  clearCart: () => set({ items: [], total: 0 }),
}), {
  name: 'cart-storage',
}));