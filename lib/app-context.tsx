'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: 'women' | 'men' | 'girls' | 'boys'
  description: string
  rating: number
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}

interface AppContextType {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Wishlist
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  
  // Auth
  isLoggedIn: boolean
  user: { id: string; email: string; name: string; role?: string } | null
  login: (userData: { id: string; email: string; name: string; role: string }) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('malar-user')
      const savedWishlist = localStorage.getItem('malar-wishlist')

      let userData: any = null
      if (savedUser) {
        userData = JSON.parse(savedUser)
        setUser(userData)
        setIsLoggedIn(true)
      }

      // Load correct cart based on user status
      const cartKey = userData?.id ? `malar-cart-${userData.id}` : 'malar-cart-guest'
      const savedCart = localStorage.getItem(cartKey)
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      } else {
        // Fallback to legacy key malar-cart
        const legacyCart = localStorage.getItem('malar-cart')
        if (legacyCart) setCart(JSON.parse(legacyCart))
      }

      // Load wishlist
      const wishlistKey = userData?.id ? `malar-wishlist-${userData.id}` : 'malar-wishlist-guest'
      const savedWishlistData = localStorage.getItem(wishlistKey)
      if (savedWishlistData) {
        setWishlist(JSON.parse(savedWishlistData))
      } else if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
    } catch (error) {
      // Clear corrupted localStorage data
      localStorage.removeItem('malar-cart')
      localStorage.removeItem('malar-cart-guest')
      localStorage.removeItem('malar-wishlist')
      localStorage.removeItem('malar-user')
    }
  }, [])

  // Save cart to localStorage and notify listeners
  useEffect(() => {
    const cartKey = isLoggedIn && user?.id ? `malar-cart-${user.id}` : 'malar-cart-guest'
    localStorage.setItem(cartKey, JSON.stringify(cart))
    // Also update legacy key for compatibility
    localStorage.setItem('malar-cart', JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'))
  }, [cart, isLoggedIn, user?.id])

  // Save wishlist to localStorage
  useEffect(() => {
    const wishlistKey = isLoggedIn && user?.id ? `malar-wishlist-${user.id}` : 'malar-wishlist-guest'
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist))
    localStorage.setItem('malar-wishlist', JSON.stringify(wishlist))
  }, [wishlist, isLoggedIn, user?.id])

  const addToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prevCart, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      )
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (!prev.find((item) => item.id === product.id)) {
        return [...prev, product]
      }
      return prev
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId)
  }

  const login = (userData: { id: string; email: string; name: string; role: string }) => {
    // 1. Get current cart (which represents guest cart)
    const guestCartStr = localStorage.getItem('malar-cart-guest') || localStorage.getItem('malar-cart')
    let guestCart: CartItem[] = []
    if (guestCartStr) {
      try { guestCart = JSON.parse(guestCartStr); } catch (e) {}
    }

    // 2. Load user's saved cart
    const userCartStr = localStorage.getItem(`malar-cart-${userData.id}`)
    let userCart: CartItem[] = []
    if (userCartStr) {
      try { userCart = JSON.parse(userCartStr); } catch (e) {}
    }

    // 3. Merge guest cart into user cart
    const mergedCart = [...userCart]
    guestCart.forEach((guestItem) => {
      const existing = mergedCart.find((item) => item.id === guestItem.id)
      if (existing) {
        existing.quantity += guestItem.quantity
      } else {
        mergedCart.push(guestItem)
      }
    })

    // Same for wishlist
    const guestWishlistStr = localStorage.getItem('malar-wishlist-guest') || localStorage.getItem('malar-wishlist')
    let guestWishlist: Product[] = []
    if (guestWishlistStr) {
      try { guestWishlist = JSON.parse(guestWishlistStr); } catch (e) {}
    }
    const userWishlistStr = localStorage.getItem(`malar-wishlist-${userData.id}`)
    let userWishlist: Product[] = []
    if (userWishlistStr) {
      try { userWishlist = JSON.parse(userWishlistStr); } catch (e) {}
    }
    const mergedWishlist = [...userWishlist]
    guestWishlist.forEach((guestItem) => {
      if (!mergedWishlist.some((item) => item.id === guestItem.id)) {
        mergedWishlist.push(guestItem)
      }
    })

    // 4. Update states
    setCart(mergedCart)
    setWishlist(mergedWishlist)
    setUser(userData)
    setIsLoggedIn(true)

    // 5. Persist to localStorage
    localStorage.setItem(`malar-cart-${userData.id}`, JSON.stringify(mergedCart))
    localStorage.setItem(`malar-wishlist-${userData.id}`, JSON.stringify(mergedWishlist))
    localStorage.removeItem('malar-cart-guest')
    localStorage.removeItem('malar-wishlist-guest')
    
    localStorage.setItem('malar-user', JSON.stringify(userData))
    localStorage.setItem('userAuth', JSON.stringify(userData))
    localStorage.setItem('userRole', userData.role)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('malar-user')
    localStorage.removeItem('userAuth')
    localStorage.removeItem('userRole')
    localStorage.removeItem('adminAuth')
    // Clear the active in-memory cart and wishlist (they are already saved under user-specific keys)
    setCart([])
    setWishlist([])
    // Remove guest and legacy keys to avoid leakage
    localStorage.removeItem('malar-cart')
    localStorage.removeItem('malar-cart-guest')
    localStorage.removeItem('malar-wishlist')
    localStorage.removeItem('malar-wishlist-guest')
  }

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoggedIn,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
