import fs from 'node:fs';

function loadEnv() {
  if (!fs.existsSync('.env')) return {};
  return Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).flatMap(line => {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    return match ? [[match[1], match[2].replace(/^(['"])(.*)\1$/, '$2')]] : [];
  }));
}

const env = loadEnv();
const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.');

const products = [
  ['shirts', 'Lagos Essential Tee', 'Soft heavyweight cotton tee with a clean Store 99 chest mark.', 18000, '1521572163474-6864f9cf17ab'],
  ['shirts', 'After Hours Graphic Tee', 'Relaxed graphic tee for late nights and easy weekends.', 22000, '1503341504253-dff4815485f1'],
  ['shirts', 'Monochrome Oversized Tee', 'Oversized everyday tee cut from breathable cotton jersey.', 24000, '1515886657613-9f3515b0c78f'],
  ['shirts', 'Gold Line Polo', 'Premium piqué polo with a subtle gold detail.', 28000, '1586790170083-2f9ceadc1c7c'],
  ['shirts', 'Weekend Camp Collar Shirt', 'Lightweight camp collar shirt for warm-weather rotation.', 32000, '1602810319428-019690571b5b'],
  ['shorts', 'Utility Cargo Shorts', 'Durable cargo shorts with practical everyday pockets.', 26000, '1591195853828-11db59a44f43'],
  ['shorts', 'Lounge Terry Shorts', 'Soft French terry shorts with an easy elastic waist.', 22000, '1562183241-b937e3f05e02'],
  ['shorts', 'Court Mesh Shorts', 'Breathable mesh shorts inspired by city courts.', 24000, '1518611012118-696072aa579a'],
  ['shorts', 'Denim Cutoff Shorts', 'Relaxed denim shorts with a clean raw hem.', 27000, '1542272604-787c3835535d'],
  ['shorts', 'Everyday Chino Shorts', 'Clean chino shorts for smart casual outfits.', 25000, '1594633312681-425c7b97ccd1'],
  ['trousers', 'Signature Straight Trousers', 'Straight-leg trousers with a polished everyday drape.', 38000, '1473966968600-fa801b869a1a'],
  ['trousers', 'Relaxed Pleat Trousers', 'Relaxed pleated trousers with room through the leg.', 42000, '1506629905607-d9f297d37c1b'],
  ['trousers', 'Technical Track Pants', 'Lightweight technical pants built for movement.', 36000, '1552902869-cbdeac1b8b8a'],
  ['trousers', 'Washed Carpenter Pants', 'Workwear-inspired pants with a relaxed fit.', 40000, '1624378439575-d8705ad7ae80'],
  ['trousers', 'Tailored Evening Pants', 'Clean tailored pants for elevated evenings.', 46000, '1594633312681-425c7b97ccd1'],
  ['hoodies', 'Heavyweight 99 Hoodie', 'A structured heavyweight hoodie with a premium hand feel.', 48000, '1556821840-3a63f15732ce'],
  ['hoodies', 'Essential Zip Hoodie', 'Everyday full-zip layer with a soft brushed interior.', 45000, '1578681994506-b8f463449011'],
  ['hoodies', 'Lagos Collegiate Hoodie', 'Relaxed collegiate hoodie inspired by Lagos energy.', 52000, '1515886657613-9f3515b0c78f'],
  ['hoodies', 'Minimal Pullover Hoodie', 'Minimal pullover silhouette for effortless layering.', 44000, '1503341504253-dff4815485f1'],
  ['hoodies', 'Contrast Panel Hoodie', 'Statement hoodie with contrast panel construction.', 56000, '1551488831-00ddcb6c6bd3'],
 ['shoes', 'Street Runner 99', 'Cushioned daily sneakers designed for city miles.', 68000, '1542291026-7eec264c27ff'],
  ['shoes', 'Court Classic Low', 'Low-top court sneakers with a timeless profile.', 62000, '1549298916-b41d501d3772'],
  ['shoes', 'Canvas High Top', 'Classic canvas high tops for everyday styling.', 54000, '1525966222134-fcfa99b8ae77'],
  ['shoes', 'Trail Motion Sneaker', 'Rugged trail-inspired sneakers with bold traction.', 76000, '1460353581641-1b820d4d2f88'],
  ['shoes', 'Minimal Leather Trainer', 'Clean leather trainers for a refined rotation.', 72000, '1495555961986-6d4c1ecb7be'],
  ['accessories', 'Everyday Carry Pack', 'Compact backpack with room for daily essentials.', 30000, '1553062407-98eeb64c6a62'],
  ['accessories', 'Structured Crossbody Bag', 'Hands-free crossbody bag with a structured finish.', 26000, '1590874103328-eac38a683ce7'],
  ['accessories', 'Store 99 Cap', 'Classic six-panel cap with an adjustable closure.', 15000, '1521369909029-2bebe0dce3b1'],
  ['accessories', 'Ribbed Everyday Beanie', 'Soft ribbed beanie for cool evenings and easy layering.', 12000, '1576871337632-b9aef4c17ab9'],
  ['accessories', 'Statement Leather Belt', 'Full-grain leather belt with a clean metal buckle.', 18000, '1624222247344-69e96e5b0b4f'],
].map(([category, name, description, price, image]) => ({
  category, name, description, price, image: `https://images.unsplash.com/photo-${image}?auto=format&fit=crop&w=900&q=80`,
}));

async function request(path, options = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`${response.status}: ${JSON.stringify(data)}`);
  return data;
}

const existing = await request('products?select=id,name');
const existingNames = new Set(existing.map(product => product.name));
let added = 0;

for (const product of products) {
  if (existingNames.has(product.name)) continue;
  const [created] = await request('products', {
    method: 'POST',
    body: JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: 10,
      is_active: true,
    }),
  });
  await request('product_images', {
    method: 'POST',
    body: JSON.stringify({
      product_id: created.id,
      image_url: product.image,
      display_order: 0,
      is_primary: true,
    }),
  });
  await request('product_sizes', {
    method: 'POST',
    body: JSON.stringify(['S', 'M', 'L', 'XL'].map((size, index) => ({
      product_id: created.id,
      size,
      stock_qty: index < 3 ? 3 : 1,
    }))),
  });
  added += 1;
}

console.log(`Product seed complete: ${added} added, ${products.length - added} already existed.`);
