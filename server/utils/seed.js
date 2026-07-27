import Category from '../models/Category.js'
import Product  from '../models/Product.js'
import User     from '../models/User.js'

const toSlug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

const discounted = (price, pct) =>
  pct > 0 ? parseFloat((price - (price * pct) / 100).toFixed(2)) : price

export const seedDatabase = async () => {
  try {
    // ── Only seed if no products yet ────────────────────────
    const existing = await Product.countDocuments()
    if (existing > 0) {
      console.log(`📦 Database already has ${existing} products — skipping seed`)
      return
    }

    console.log('🌱 Seeding database...')

    // ── Clear any partial data ───────────────────────────────
    await Product.deleteMany({})
    await Category.deleteMany({})
    await User.deleteMany({})

    // ── Admin + demo user ────────────────────────────────────
    await User.create([
      { name: 'Alex Admin',    email: 'admin@alexstore.com',    password: 'admin123',    role: 'admin',    phone: '+251911000001' },
      { name: 'Demo Customer', email: 'customer@alexstore.com', password: 'customer123', role: 'customer', phone: '+251911000002' },
    ])

    // ── Categories ───────────────────────────────────────────
    const catData = [
      { name: 'Electronics',   description: 'Phones, laptops, gadgets',     image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', publicId: '' } },
      { name: 'Fashion',       description: 'Clothing and accessories',      image: { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', publicId: '' } },
      { name: 'Home Living',   description: 'Furniture and home decor',      image: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', publicId: '' } },
      { name: 'Beauty',        description: 'Skincare and personal care',    image: { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', publicId: '' } },
      { name: 'Sports',        description: 'Equipment and sportswear',      image: { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', publicId: '' } },
      { name: 'Food',          description: 'Groceries and beverages',       image: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', publicId: '' } },
    ]

    // Add slug manually so insertMany works
    catData.forEach(c => { c.slug = toSlug(c.name) })
    const categories = await Category.insertMany(catData)

    // Build lookup
    const C = {}
    categories.forEach(c => { C[c.name] = c._id })

    // ── Products ─────────────────────────────────────────────
    const products = [
      { name: 'Samsung Galaxy A55 5G',      price: 45000,  discount: 10, category: C['Electronics'],  brand: 'Samsung',     stock: 25, isFeatured: true,  soldCount: 120, rating: 4.5, reviewCount: 48,  tags: ['phone','samsung','5g'],      images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80', publicId: '' }], description: 'Samsung Galaxy A55 5G with 50MP triple camera, 5000mAh battery and 6.6-inch Super AMOLED display.' },
      { name: 'iPhone 15 128GB',             price: 120000, discount: 5,  category: C['Electronics'],  brand: 'Apple',       stock: 15, isFeatured: true,  soldCount: 200, rating: 4.8, reviewCount: 95,  tags: ['iphone','apple','ios'],       images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', publicId: '' }], description: 'Apple iPhone 15 with A16 Bionic chip, 48MP camera, Dynamic Island and USB-C.' },
      { name: 'Wireless Headphones Pro',     price: 8500,   discount: 20, category: C['Electronics'],  brand: 'Sony',        stock: 40, isFeatured: true,  soldCount: 85,  rating: 4.3, reviewCount: 32,  tags: ['headphones','bluetooth'],     images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', publicId: '' }], description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.' },
      { name: 'Dell Inspiron 15 Laptop',     price: 75000,  discount: 5,  category: C['Electronics'],  brand: 'Dell',        stock: 12, isFeatured: true,  soldCount: 48,  rating: 4.4, reviewCount: 22,  tags: ['laptop','dell','windows'],    images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', publicId: '' }], description: 'Dell Inspiron 15 with Intel Core i5, 8GB RAM, 512GB SSD, 15.6-inch FHD display.' },
      { name: 'Smart Watch Fitness Band',    price: 6500,   discount: 15, category: C['Electronics'],  brand: 'FitTech',     stock: 45, isFeatured: true,  soldCount: 130, rating: 4.3, reviewCount: 63,  tags: ['smartwatch','fitness'],       images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', publicId: '' }], description: 'Smartwatch with heart rate, GPS, sleep tracking and 7-day battery life.' },
      { name: 'Men Classic Leather Jacket',  price: 12000,  discount: 15, category: C['Fashion'],      brand: 'Leather Co',  stock: 30, isFeatured: false, soldCount: 60,  rating: 4.6, reviewCount: 28,  tags: ['jacket','leather','mens'],    images: [{ url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80', publicId: '' }], description: 'Premium genuine leather jacket with modern slim fit for casual occasions.' },
      { name: 'Women Summer Floral Dress',   price: 3500,   discount: 0,  category: C['Fashion'],      brand: 'StyleHub',    stock: 50, isFeatured: true,  soldCount: 145, rating: 4.4, reviewCount: 67,  tags: ['dress','womens','summer'],    images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', publicId: '' }], description: 'Elegant floral print summer dress made from breathable cotton fabric.' },
      { name: 'Modern Minimalist Sofa',      price: 35000,  discount: 8,  category: C['Home Living'],  brand: 'FurniCraft',  stock: 10, isFeatured: true,  soldCount: 22,  rating: 4.7, reviewCount: 15,  tags: ['sofa','furniture'],           images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', publicId: '' }], description: 'Contemporary 3-seater sofa with premium fabric upholstery and solid wood legs.' },
      { name: 'Vitamin C Brightening Serum', price: 2200,   discount: 0,  category: C['Beauty'],       brand: 'GlowLab',     stock: 80, isFeatured: false, soldCount: 310, rating: 4.9, reviewCount: 124, tags: ['serum','skincare','beauty'],  images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80', publicId: '' }], description: 'Advanced vitamin C serum with 20% L-ascorbic acid, hyaluronic acid and vitamin E.' },
      { name: 'Yoga Mat Non-Slip 6mm',       price: 1800,   discount: 10, category: C['Sports'],       brand: 'FitLife',     stock: 60, isFeatured: false, soldCount: 75,  rating: 4.5, reviewCount: 41,  tags: ['yoga','mat','fitness'],       images: [{ url: 'https://images.unsplash.com/photo-1601925228654-a1f52daafd28?w=600&q=80', publicId: '' }], description: 'Premium 6mm thick yoga mat with non-slip TPE material and carrying strap.' },
      { name: 'Nike Air Max Running Shoes',  price: 15000,  discount: 12, category: C['Sports'],       brand: 'Nike',        stock: 35, isFeatured: true,  soldCount: 92,  rating: 4.6, reviewCount: 55,  tags: ['shoes','nike','running'],     images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', publicId: '' }], description: 'Nike Air Max with visible air cushioning, breathable mesh upper and rubber outsole.' },
      { name: 'Ethiopian Coffee Premium',    price: 850,    discount: 0,  category: C['Food'],         brand: 'Kaffa Beans', stock: 200, isFeatured: false, soldCount: 420, rating: 4.9, reviewCount: 186, tags: ['coffee','ethiopian'],         images: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80', publicId: '' }], description: 'Authentic Ethiopian Yirgacheffe single-origin coffee. 500g medium roast bag.' },
    ]

    // Compute slug + discountedPrice (insertMany bypasses pre-save hooks)
    products.forEach(p => {
      p.slug = toSlug(p.name)
      p.discountedPrice = discounted(p.price, p.discount)
      p.isActive = true
    })

    await Product.insertMany(products)

    // Update category product counts
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat._id })
      await Category.findByIdAndUpdate(cat._id, { productCount: count })
    }

    const total = await Product.countDocuments()
    console.log(`✅ Seeded ${total} products, ${categories.length} categories, 2 users`)
    console.log('─────────────────────────────────────────────────')
    console.log('👤 Admin login:    admin@alexstore.com    / admin123')
    console.log('👤 Customer login: customer@alexstore.com / customer123')
    console.log('─────────────────────────────────────────────────')

  } catch (err) {
    console.error('❌ Seed error:', err.message)
  }
}
