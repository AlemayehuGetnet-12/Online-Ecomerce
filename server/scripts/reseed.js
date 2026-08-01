/**
 * ─────────────────────────────────────────────────────────
 *  Alex Store — Force Re-Seed Script
 *  Run: node scripts/reseed.js
 *
 *  This wipes ALL existing data and re-creates:
 *    • Tolgi Admin    (tolgi@alexstore.com  / tolgi123)
 *    • Alex Admin     (admin@alexstore.com  / admin123)
 *    • Demo Customer  (customer@alexstore.com / customer123)
 *    • 7 categories
 *    • 19 products
 * ─────────────────────────────────────────────────────────
 */

import dotenv   from 'dotenv'
import path     from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

// Resolve .env from server root (one level up from scripts/)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const MONGO_URI = process.env.MONGO_URI

// ── Minimal inline models (avoids import path issues) ──────
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  phone: String, role: { type: String, default: 'customer' },
  avatar: { type: String, default: '' }, isActive: { type: Boolean, default: true },
  wishlist: [], address: { street:String, city:String, region:String, country:String, zipCode:String },
}, { timestamps: true })
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true }, description: String,
  image: { url: String, publicId: String },
  slug: { type: String, unique: true }, isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  name: String, description: String, price: Number, discount: Number,
  discountedPrice: Number, category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: String, stock: Number,
  images: [{ url: String, publicId: String }],
  rating: { type: Number, default: 0 }, reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 }, slug: { type: String, unique: true },
  isActive: { type: Boolean, default: true }, isFeatured: { type: Boolean, default: false },
  tags: [String],
}, { timestamps: true })

const User     = mongoose.models.User     || mongoose.model('User',     userSchema)
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)
const Product  = mongoose.models.Product  || mongoose.model('Product',  productSchema)

// ── Helpers ────────────────────────────────────────────────
const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

const dp = (price, pct) =>
  pct > 0 ? parseFloat((price - price * pct / 100).toFixed(2)) : price

// ── Main ───────────────────────────────────────────────────
async function main () {
  if (!MONGO_URI || MONGO_URI.includes('localhost')) {
    console.error('❌ MONGO_URI not found or is localhost.')
    console.error('   Make sure server/.env has your Atlas connection string.')
    process.exit(1)
  }
  console.log('\n🔌 Connecting to MongoDB Atlas...')
  await mongoose.connect(MONGO_URI)
  console.log(`✅ Connected: ${mongoose.connection.host} / ${mongoose.connection.name}`)

  console.log('\n🗑️  Clearing existing data...')
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ])

  // ── Users ────────────────────────────────────────────────
  console.log('\n👤 Creating users...')
  const users = [
    { name: 'Tolgi Admin',    email: 'tolgi@alexstore.com',     password: 'tolgi123',    role: 'admin',    phone: '+251931756792' },
    { name: 'Alex Admin',     email: 'admin@alexstore.com',     password: 'admin123',    role: 'admin',    phone: '+251911000001' },
    { name: 'Demo Customer',  email: 'customer@alexstore.com',  password: 'customer123', role: 'customer', phone: '+251911000002' },
  ]
  for (const u of users) {
    await User.create(u)
    console.log(`   ✔ ${u.role.padEnd(8)} ${u.email}  /  ${u.password}`)
  }

  // ── Categories ───────────────────────────────────────────
  console.log('\n📂 Creating categories...')
  const catData = [
    { name: 'Electronics', description: 'Phones, laptops, gadgets and accessories',   image: { url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80', publicId: '' } },
    { name: 'Fashion',     description: 'Clothing, shoes and accessories',            image: { url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80', publicId: '' } },
    { name: 'Home Living', description: 'Furniture, kitchen and home decor',          image: { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', publicId: '' } },
    { name: 'Beauty',      description: 'Skincare, makeup and personal care',         image: { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', publicId: '' } },
    { name: 'Sports',      description: 'Sports equipment and sportswear',            image: { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', publicId: '' } },
    { name: 'Food',        description: 'Groceries, snacks and beverages',            image: { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80', publicId: '' } },
    { name: 'Accessories', description: 'Bags, watches and accessories',              image: { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', publicId: '' } },
  ]
  catData.forEach(c => { c.slug = slug(c.name) })
  const cats = await Category.insertMany(catData)
  const C = {}
  cats.forEach(c => { C[c.name] = c._id; console.log(`   ✔ ${c.name}`) })

  // ── Products ─────────────────────────────────────────────
  console.log('\n📦 Creating products...')
  const products = [
    // ffElectronics (6)
    { name: 'Samsung Galaxy A55 5G',       price: 45000,  discount: 10, category: C['Electronics'], brand: 'Samsung',      stock: 25,  isFeatured: true,  soldCount: 120, rating: 4.5, reviewCount: 48,  tags: ['phone','samsung'],    images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80', publicId: '' }], description: 'Samsung Galaxy A55 5G with 50MP triple camera, 5000mAh battery and 6.6-inch Super AMOLED display.' },
    { name: 'iPhone 15 128GB',              price: 120000, discount: 5,  category: C['Electronics'], brand: 'Apple',        stock: 15,  isFeatured: true,  soldCount: 200, rating: 4.8, reviewCount: 95,  tags: ['iphone','apple'],      images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80', publicId: '' }], description: 'Apple iPhone 15 with A16 Bionic chip, 48MP camera system, Dynamic Island and USB-C.' },
    { name: 'Sony WH-1000XM5 Headphones',  price: 9500,   discount: 20, category: C['Electronics'], brand: 'Sony',         stock: 40,  isFeatured: true,  soldCount: 85,  rating: 4.3, reviewCount: 32,  tags: ['headphones','sony'],   images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', publicId: '' }], description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and LDAC support.' },
    { name: 'Dell Inspiron 15 Laptop',      price: 75000,  discount: 5,  category: C['Electronics'], brand: 'Dell',         stock: 12,  isFeatured: true,  soldCount: 48,  rating: 4.4, reviewCount: 22,  tags: ['laptop','dell'],       images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', publicId: '' }], description: 'Dell Inspiron 15 with Intel Core i5, 8GB RAM, 512GB SSD and 15.6-inch FHD display.' },
    { name: 'Smart Watch Series X',         price: 6500,   discount: 15, category: C['Electronics'], brand: 'FitTech',      stock: 45,  isFeatured: true,  soldCount: 130, rating: 4.3, reviewCount: 63,  tags: ['smartwatch','fitness'], images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', publicId: '' }], description: 'Smartwatch with heart rate, GPS, blood oxygen, sleep tracking and 7-day battery.' },
    { name: 'iPad Air 11 inch M2',          price: 95000,  discount: 8,  category: C['Electronics'], brand: 'Apple',        stock: 10,  isFeatured: false, soldCount: 42,  rating: 4.7, reviewCount: 18,  tags: ['ipad','tablet'],       images: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', publicId: '' }], description: 'iPad Air with M2 chip, 11-inch Liquid Retina display and Apple Pencil support.' },
    // Fashion (3)
    { name: 'Men Classic Leather Jacket',   price: 12000,  discount: 15, category: C['Fashion'],     brand: 'Leather Co',   stock: 30,  isFeatured: false, soldCount: 60,  rating: 4.6, reviewCount: 28,  tags: ['jacket','mens'],       images: [{ url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80', publicId: '' }], description: 'Premium genuine leather jacket with modern slim fit. Perfect for casual and semi-formal occasions.' },
    { name: 'Women Summer Floral Dress',    price: 3500,   discount: 0,  category: C['Fashion'],     brand: 'StyleHub',     stock: 50,  isFeatured: true,  soldCount: 145, rating: 4.4, reviewCount: 67,  tags: ['dress','womens'],      images: [{ url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', publicId: '' }], description: 'Elegant floral print summer dress made from breathable cotton fabric.' },
    { name: 'Nike Air Max 270',             price: 15000,  discount: 12, category: C['Fashion'],     brand: 'Nike',         stock: 35,  isFeatured: true,  soldCount: 92,  rating: 4.6, reviewCount: 55,  tags: ['shoes','nike'],        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', publicId: '' }], description: 'Nike Air Max 270 with large Air unit, breathable mesh upper and durable rubber outsole.' },
    // Home Living (2)
    { name: 'Modern Minimalist Sofa',       price: 35000,  discount: 8,  category: C['Home Living'], brand: 'FurniCraft',   stock: 10,  isFeatured: true,  soldCount: 22,  rating: 4.7, reviewCount: 15,  tags: ['sofa','furniture'],    images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', publicId: '' }], description: 'Contemporary 3-seater sofa with premium fabric upholstery and solid wood legs.' },
    { name: 'Non-Stick Cookware 12-Piece',  price: 4500,   discount: 10, category: C['Home Living'], brand: 'KitchenPro',   stock: 60,  isFeatured: false, soldCount: 38,  rating: 4.2, reviewCount: 12,  tags: ['kitchen','cookware'],  images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', publicId: '' }], description: 'Complete 12-piece non-stick cookware set with heat-resistant handles.' },
    // Beauty (2)
    { name: 'Vitamin C Brightening Serum',  price: 2200,   discount: 0,  category: C['Beauty'],      brand: 'GlowLab',      stock: 80,  isFeatured: false, soldCount: 310, rating: 4.9, reviewCount: 124, tags: ['serum','skincare'],    images: [{ url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80', publicId: '' }], description: 'Advanced vitamin C serum with 20% L-ascorbic acid, hyaluronic acid and vitamin E.' },
    { name: 'Luxury Oud Perfume 100ml',     price: 3800,   discount: 5,  category: C['Beauty'],      brand: 'Noir',         stock: 45,  isFeatured: true,  soldCount: 78,  rating: 4.5, reviewCount: 34,  tags: ['perfume','luxury'],    images: [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', publicId: '' }], description: 'Elegant unisex oud perfume with notes of rose, sandalwood and musk. Long-lasting.' },
    // Sports (2)
    { name: 'Professional Yoga Mat 6mm',    price: 1800,   discount: 10, category: C['Sports'],      brand: 'FitLife',      stock: 60,  isFeatured: false, soldCount: 75,  rating: 4.5, reviewCount: 41,  tags: ['yoga','fitness'],      images: [{ url: 'https://images.unsplash.com/photo-1601925228654-a1f52daafd28?w=600&q=80', publicId: '' }], description: 'Premium 6mm thick yoga mat with non-slip TPE material, alignment lines and carrying strap.' },
    { name: 'Adjustable Dumbbell 2.5-25kg', price: 12000,  discount: 0,  category: C['Sports'],      brand: 'IronFit',      stock: 20,  isFeatured: false, soldCount: 44,  rating: 4.6, reviewCount: 19,  tags: ['dumbbell','gym'],      images: [{ url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', publicId: '' }], description: 'Space-saving adjustable dumbbell set. Replaces 15 pairs of dumbbells.' },
    // Food (2)
    { name: 'Ethiopian Yirgacheffe Coffee', price: 850,    discount: 0,  category: C['Food'],        brand: 'Kaffa Beans',  stock: 200, isFeatured: false, soldCount: 420, rating: 4.9, reviewCount: 186, tags: ['coffee','ethiopian'],  images: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80', publicId: '' }], description: 'Authentic single-origin Ethiopian Yirgacheffe coffee, medium roast. 500g bag.' },
    { name: 'Pure Ethiopian Wild Honey',    price: 650,    discount: 0,  category: C['Food'],        brand: 'Pure Ethiopia', stock: 150, isFeatured: false, soldCount: 280, rating: 4.8, reviewCount: 92, tags: ['honey','organic'],     images: [{ url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80', publicId: '' }], description: 'Pure organic Ethiopian wild honey. No additives, naturally harvested from wild hives.' },
    // Accessories (2)
    { name: 'Premium Leather Handbag',      price: 8900,   discount: 10, category: C['Accessories'], brand: 'UrbanStyle',   stock: 25,  isFeatured: true,  soldCount: 55,  rating: 4.4, reviewCount: 23,  tags: ['bag','leather'],       images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', publicId: '' }], description: 'Premium genuine leather handbag with multiple compartments and gold-plated hardware.' },
    { name: 'Classic Stainless Steel Watch', price: 5500,  discount: 0,  category: C['Accessories'], brand: 'TimeMaster',   stock: 30,  isFeatured: true,  soldCount: 67,  rating: 4.6, reviewCount: 31,  tags: ['watch','steel'],       images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80', publicId: '' }], description: 'Elegant stainless steel analog watch with sapphire crystal glass and 5-year warranty.' },
  ]

  products.forEach(p => {
    p.slug            = slug(p.name)
    p.discountedPrice = dp(p.price, p.discount)
    p.isActive        = true
  })

  await Product.insertMany(products)

  // Update category counts
  for (const cat of cats) {
    const count = await Product.countDocuments({ category: cat._id })
    await Category.findByIdAndUpdate(cat._id, { productCount: count })
  }

  const totalProds = await Product.countDocuments()
  console.log(`   ✔ ${totalProds} products inserted`)

  // ── Final summary ────────────────────────────────────────
  console.log('\n' + '═'.repeat(55))
  console.log('  ✅  SEED COMPLETE')
  console.log('═'.repeat(55))
  console.log('  ADMIN ACCOUNTS:')
  console.log('  ┌──────────────────────────────────────────────┐')
  console.log('  │  👤 Tolgi   tolgi@alexstore.com   / tolgi123 │')
  console.log('  │  👤 Alex    admin@alexstore.com   / admin123  │')
  console.log('  ├──────────────────────────────────────────────┤')
  console.log('  │  👥 Demo    customer@alexstore.com / customer123 │')
  console.log('  └──────────────────────────────────────────────┘')
  console.log(`  📦 Products : ${totalProds}`)
  console.log(`  📂 Categories: ${cats.length}`)
  console.log('═'.repeat(55) + '\n')

  await mongoose.disconnect()
  console.log('🔌 Disconnected. Done!')
}

main().catch(err => {
  console.error('❌ Fatal seed error:', err.message)
  process.exit(1)
})
