import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import playSound from "../utils/sound";

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

export const useAuthStore = create(
  persist(
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
            axios
              .get(`${serverApi}/auth/checkAuth`)
              .catch(() => ({ data: { isAuthenticated: false } })),
            get().isAuthenticated
              ? axios
                  .get(`${serverApi}/auth/checkAdminAuth`)
                  .catch(() => ({ data: { isAdmin: false } }))
              : Promise.resolve({ data: { isAdmin: false } })
          ]);

          set({
            user: authCheck.data.user || null,
            isAuthenticated: authCheck.data.isAuthenticated || false,
            isAdmin: adminCheck.data.isAdmin || false,
            isCheckingAuth: false
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isCheckingAuth: false,
            error: error.message || "Failed to initialize authentication"
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

          return response.data; // ✅ success
        } catch (error) {
          let errorMessage =
            error.response?.data?.message ||
            "Signup failed. Please try again later.";

          if (errorMessage.includes("User with this email already exists")) {
            errorMessage = "User with this email already exists";
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false
          });

          throw new Error(errorMessage); // ❌ prevents redirect
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axios.post(
            `${serverApi}/auth/login`,
            {
              email: email.trim(),
              password: password.trim()
            },
            {
              headers: { "Content-Type": "application/json" }
            }
          );

          set({
            user: response.data.user,
            isAuthenticated: true,
            isAdmin: response.data.user?.isAdmin || false,
            isLoading: false
          });

          return response.data; // ✅ success
        } catch (error) {
          let errorMessage =
            error.response?.data?.message ||
            "Login failed. Please try again later.";

          if (errorMessage.includes("Invalid email or password")) {
            errorMessage = "Invalid email or password, please try again.";
          }

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false
          });

          throw new Error(errorMessage); // ❌ prevents redirect
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          await axios.post(`${serverApi}/auth/logout`);

          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Logout failed";

          set({
            error: errorMessage,
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
        } catch {
          set({ isAdmin: false });
          return false;
        }
      }
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin
      })
    }
  )
);

// Product Store
export const useProductStore = create(set => ({
  products: [],
  featuredProducts: [],
  categories: ["t-shirts", "jeans", "shoes"],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${serverApi}/products/getAllProducts`);
      set({
        products: response.data.products || [],
        featuredProducts:
          response.data.products?.filter(p => p.isFeatured) || [],
        loading: false
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot connect to server"
          : "Failed to fetch products");
      set({
        error: errorMessage,
        loading: false
      });
    }
  }
}));

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      // ✅ FIXED ADD TO CART (supports quantity properly)
      addToCart: (product) => {
        const qty = Number(product.quantity || 1);

        const existingItem = get().items.find((item) => {
          return (
            item._id === product._id &&
            JSON.stringify(item.variant || {}) === JSON.stringify(product.variant || {})
          );
        });

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item._id === product._id &&
              JSON.stringify(item.variant || {}) === JSON.stringify(product.variant || {})
                ? {
                    ...item,
                    quantity: item.quantity + qty,
                  }
                : item
            ),
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                ...product,
                quantity: qty,
              },
            ],
          }));
        }

        playSound("addedToCart.wav");
        get().calculateTotal();
      },

      // ✅ REMOVE ITEM
      removeFromCart: (id, variant = null) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (!variant) return item._id !== id;

            return !(
              item._id === id &&
              JSON.stringify(item.variant || {}) === JSON.stringify(variant)
            );
          }),
        }));

        get().calculateTotal();
      },

      // ✅ UPDATE QUANTITY
      updateQuantity: (id, quantity, variant = null) => {
        if (quantity <= 0) {
          get().removeFromCart(id, variant);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (!variant) {
              return item._id === id ? { ...item, quantity } : item;
            }

            return item._id === id &&
              JSON.stringify(item.variant || {}) === JSON.stringify(variant)
              ? { ...item, quantity }
              : item;
          }),
        }));

        get().calculateTotal();
      },

      // ✅ TOTAL CALCULATION FIXED
      calculateTotal: () => {
        const total = get().items.reduce((sum, item) => {
          return sum + item.price * (item.quantity || 1);
        }, 0);

        set({ total });
      },

      // ✅ CLEAR CART
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);