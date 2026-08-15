import Category from '../models/Category.js'
import Product  from '../models/Product.js'
import User     from '../models/User.js'

const toSlug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

const discounted = (price, pct) =>
  pct > 0 ? parseFloat((price - (price * pct) / 100).toFixed(2)) : price

export const seedDatabase = async () => {
  try {
    const productCount  = await Product.countDocuments()
    const categoryCount = await Category.countDocuments()
    const userCount     = await User.countDocuments()

    const forceSeed = process.env.FORCE_SEED === 'true'

    // Seed if forced, OR if any collection is empty (incomplete data)
    if (!forceSeed && productCount > 0 && categoryCount > 0 && userCount > 0) {
      console.log(`📦 Database OK — ${productCount} products, ${categoryCount} categories, ${userCount} users`)
      return
    }

    if (forceSeed) {
      console.log('🔄 FORCE_SEED=true — wiping and reseeding...')
    } else {
      console.log(`⚠️  Incomplete data (products:${productCount} categories:${categoryCount} users:${userCount}) — reseeding...`)
    }

    await runSeed()
  } catch (err) {
    console.error('❌ Seed error:', err.message)
  }
}

async function runSeed () {
  console.log('🌱 Seeding database...')

  await Product.deleteMany({})
  await Category.deleteMany({})
  await User.deleteMany({})

  // ── Users ────────────────────────────────────────────────
  await User.create([
    {
      name:     'Tolgi Admin',
      email:    'tolgi@alexstore.com',
      password: 'tolgi123',
      role:     'admin',
      phone:    '+251931756792',
    },
    {
      name:     'Alex Admin',
      email:    'admin@alexstore.com',
      password: 'admin123',
      role:     'admin',
      phone:    '+251911000001',
    },
    {
      name:     'Demo Customer',
      email:    'customer@alexstore.com',
      password: 'customer123',
      role:     'customer',
      phone:    '+251911000002',
    },
  ])

  // ── Categories ───────────────────────────────────────────
  const catData = [
    { name: 'Electronics', description: 'Phones, laptops, gadgets and accessories',  image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', publicId: '' } },
    { name: 'Fashion',     description: 'Clothing, shoes and accessories',           image: { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', publicId: '' } },
    { name: 'Home Living', description: 'Furniture, kitchen and home decor',         image: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', publicId: '' } },
    { name: 'Beauty',      description: 'Skincare, makeup and personal care',        image: { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', publicId: '' } },
    { name: 'Sports',      description: 'Sports equipment and sportswear',           image: { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', publicId: '' } },
    { name: 'Food',        description: 'Groceries, snacks and beverages',           image: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', publicId: '' } },
    { name: 'Accessories', description: 'Bags, watches and accessories',             image: { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', publicId: '' } },
  ]
  catData.forEach(c => { c.slug = toSlug(c.name) })
  const categories = await Category.insertMany(catData)

  const C = {}
  categories.forEach(c => { C[c.name] = c._id })

  // ── Products ─────────────────────────────────────────────
  const products = [
    // Electronics
    { name: 'Samsung Galaxy A55 5G',       price: 45000,  discount: 10, category: C['Electronics'], brand: 'Samsung',     stock: 25,  isFeatured: true,  soldCount: 120, rating: 4.5, reviewCount: 48,  tags: ['phone','samsung','5g'],       images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80', publicId: '' }], description: 'Samsung Galaxy A55 5G with 50MP triple camera, 5000mAh battery and 6.6-inch Super AMOLED display.' },
    { name: 'iPhone 15 128GB',              price: 120000, discount: 5,  category: C['Electronics'], brand: 'Apple',       stock: 15,  isFeatured: true,  soldCount: 200, rating: 4.8, reviewCount: 95,  tags: ['iphone','apple','ios'],        images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', publicId: '' }], description: 'Apple iPhone 15 with A16 Bionic chip, 48MP camera, Dynamic Island and USB-C.' },
    { name: 'Sony Wireless Headphones',     price: 8500,   discount: 20, category: C['Electronics'], brand: 'Sony',        stock: 40,  isFeatured: true,  soldCount: 85,  rating: 4.3, reviewCount: 32,  tags: ['headphones','bluetooth'],      images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', publicId: '' }], description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.' },
    { name: 'Dell Inspiron 15 Laptop',      price: 75000,  discount: 5,  category: C['Electronics'], brand: 'Dell',        stock: 12,  isFeatured: true,  soldCount: 48,  rating: 4.4, reviewCount: 22,  tags: ['laptop','dell','windows'],     images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', publicId: '' }], description: 'Dell Inspiron 15 with Intel Core i5, 8GB RAM, 512GB SSD, 15.6-inch FHD display.' },
    { name: 'Smart Watch Fitness Band',     price: 6500,   discount: 15, category: C['Electronics'], brand: 'FitTech',     stock: 45,  isFeatured: true,  soldCount: 130, rating: 4.3, reviewCount: 63,  tags: ['smartwatch','fitness'],        images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', publicId: '' }], description: 'Smartwatch with heart rate monitor, GPS, sleep tracking and 7-day battery.' },
    { name: 'iPad Air 11 inch',             price: 95000,  discount: 8,  category: C['Electronics'], brand: 'Apple',       stock: 10,  isFeatured: true,  soldCount: 42,  rating: 4.7, reviewCount: 18,  tags: ['ipad','apple','tablet'],       images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', publicId: '' }], description: 'iPad Air with M2 chip, 11-inch Liquid Retina display and Apple Pencil support.' },
    // Fashion
    { name: 'Men Classic Leather Jacket',   price: 12000,  discount: 15, category: C['Fashion'],     brand: 'Leather Co',  stock: 30,  isFeatured: false, soldCount: 60,  rating: 4.6, reviewCount: 28,  tags: ['jacket','leather','mens'],     images: [{ url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80', publicId: '' }], description: 'Premium genuine leather jacket with modern slim fit for casual occasions.' },
    { name: 'Women Summer Floral Dress',    price: 3500,   discount: 0,  category: C['Fashion'],     brand: 'StyleHub',    stock: 50,  isFeatured: true,  soldCount: 145, rating: 4.4, reviewCount: 67,  tags: ['dress','womens','summer'],     images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', publicId: '' }], description: 'Elegant floral print summer dress made from breathable cotton fabric.' },
    { name: 'Nike Air Max Running Shoes',   price: 15000,  discount: 12, category: C['Fashion'],     brand: 'Nike',        stock: 35,  isFeatured: true,  soldCount: 92,  rating: 4.6, reviewCount: 55,  tags: ['shoes','nike','running'],      images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', publicId: '' }], description: 'Nike Air Max with visible air cushioning, breathable mesh upper and rubber outsole.' },
    // Home Living
    { name: 'Modern Minimalist Sofa',       price: 35000,  discount: 8,  category: C['Home Living'], brand: 'FurniCraft',  stock: 10,  isFeatured: true,  soldCount: 22,  rating: 4.7, reviewCount: 15,  tags: ['sofa','furniture'],            images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', publicId: '' }], description: 'Contemporary 3-seater sofa with premium fabric upholstery and solid wood legs.' },
    { name: 'Stainless Steel Kitchen Set',  price: 4500,   discount: 10, category: C['Home Living'], brand: 'KitchenPro',  stock: 60,  isFeatured: false, soldCount: 38,  rating: 4.2, reviewCount: 12,  tags: ['kitchen','cookware'],          images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', publicId: '' }], description: 'Complete 12-piece stainless steel cookware set for modern kitchens.' },
    // Beauty
    { name: 'Vitamin C Brightening Serum',  price: 2200,   discount: 0,  category: C['Beauty'],      brand: 'GlowLab',     stock: 80,  isFeatured: false, soldCount: 310, rating: 4.9, reviewCount: 124, tags: ['serum','skincare','beauty'],   images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80', publicId: '' }], description: 'Advanced vitamin C serum with 20% L-ascorbic acid, hyaluronic acid and vitamin E.' },
    { name: 'Luxury Perfume Collection',    price: 3800,   discount: 5,  category: C['Beauty'],      brand: 'Noir',        stock: 45,  isFeatured: true,  soldCount: 78,  rating: 4.5, reviewCount: 34,  tags: ['perfume','fragrance'],         images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', publicId: '' }], description: 'Elegant unisex perfume with notes of oud, rose and sandalwood.' },
    // Sports
    { name: 'Yoga Mat Non-Slip 6mm',        price: 1800,   discount: 10, category: C['Sports'],      brand: 'FitLife',     stock: 60,  isFeatured: false, soldCount: 75,  rating: 4.5, reviewCount: 41,  tags: ['yoga','mat','fitness'],        images: [{ url: 'https://images.unsplash.com/photo-1601925228654-a1f52daafd28?w=600&q=80', publicId: '' }], description: 'Premium 6mm thick yoga mat with non-slip TPE material and carrying strap.' },
    { name: 'Adjustable Dumbbell Set',      price: 12000,  discount: 0,  category: C['Sports'],      brand: 'IronFit',     stock: 20,  isFeatured: false, soldCount: 44,  rating: 4.6, reviewCount: 19,  tags: ['dumbbell','gym','fitness'],    images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', publicId: '' }], description: 'Adjustable dumbbell set from 2.5kg to 25kg. Perfect for home workouts.' },
    // Food
    { name: 'Ethiopian Yirgacheffe Coffee', price: 850,    discount: 0,  category: C['Food'],        brand: 'Kaffa Beans', stock: 200, isFeatured: false, soldCount: 420, rating: 4.9, reviewCount: 186, tags: ['coffee','ethiopian','yirgacheffe'], images: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80', publicId: '' }], description: 'Authentic Ethiopian Yirgacheffe single-origin coffee. 500g medium roast bag.' },
    { name: 'Organic Honey 500g',           price: 650,    discount: 0,  category: C['Food'],        brand: 'Pure Ethiopia', stock: 150, isFeatured: false, soldCount: 280, rating: 4.8, reviewCount: 92, tags: ['honey','organic','natural'],   images: [{ url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', publicId: '' }], description: 'Pure organic Ethiopian wild honey. No additives. Naturally harvested.' },
    // Accessories
    { name: 'Leather Handbag Premium',      price: 8900,   discount: 10, category: C['Accessories'], brand: 'UrbanStyle',  stock: 25,  isFeatured: true,  soldCount: 55,  rating: 4.4, reviewCount: 23,  tags: ['bag','handbag','leather'],     images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', publicId: '' }], description: 'Premium genuine leather handbag with multiple compartments and gold hardware.' },
    { name: 'Classic Aviator Sunglasses',   price: 2500,   discount: 15, category: C['Accessories'], brand: 'RayStyle',    stock: 70,  isFeatured: false, soldCount: 110, rating: 4.3, reviewCount: 47,  tags: ['sunglasses','uv','fashion'],   images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', publicId: '' }], description: 'Classic aviator sunglasses with UV400 protection and metal frame.' },
    { name: 'Stainless Steel Watch',        price: 5500,   discount: 0,  category: C['Accessories'], brand: 'TimeMaster', stock: 30,   isFeatured: true,  soldCount: 67,  rating: 4.6, reviewCount: 31,  tags: ['watch','steel','fashion'],     images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', publicId: '' }], description: 'Elegant stainless steel analog watch with sapphire crystal glass.' },
  ]

  products.forEach(p => {
    p.slug            = toSlug(p.name)
    p.discountedPrice = discounted(p.price, p.discount)
    p.isActive        = true
  })

  await Product.insertMany(products)

  // Update category product counts
  for (const cat of categories) {
    const count = await Product.countDocuments({ category: cat._id })
    await Category.findByIdAndUpdate(cat._id, { productCount: count })
  }

  const totalProducts = await Product.countDocuments()
  console.log(`✅ Seeded ${totalProducts} products, ${categories.length} categories, 3 users`)
  console.log('─────────────────────────────────────────────────────')
  console.log('👤 TOLGI Admin:    tolgi@alexstore.com    / tolgi123')
  console.log('👤 Alex Admin:     admin@alexstore.com    / admin123')
  console.log('👤 Customer:       customer@alexstore.com / customer123')
  console.log('─────────────────────────────────────────────────────')
}
