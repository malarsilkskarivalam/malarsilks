import { Product } from './app-context'

// Static products have been removed.
// All products are now managed exclusively through the Admin Panel.
export const PRODUCTS: Product[] = []

export const CATEGORIES = [
  {
    name: 'Women',
    id: 'women',
    description: 'Traditional and modern silk sarees and attires',
    image: '/images/categories/women.png'
  },
  {
    name: 'Men',
    id: 'men',
    description: 'Elegant formal and casual silk menswear',
    image: '/images/categories/men.png'
  },
  {
    name: 'Girls',
    id: 'girls',
    description: 'Colorful traditional lehengas and ethnic wear',
    image: '/images/categories/girls.png'
  },
  {
    name: 'Boys',
    id: 'boys',
    description: 'Stylish traditional kurtas and festival sets',
    image: '/images/categories/boys.png'
  },
]

export const getProductsByCategory = (category?: string) => {
  if (!category) return PRODUCTS
  return PRODUCTS.filter(p => p.category === category)
}

export const getProductById = (id: string) => {
  return PRODUCTS.find(p => p.id === id)
}

export const getFeaturedProducts = () => {
  return PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 8)
}
