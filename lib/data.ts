export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  tags: string[];
  isVeg: boolean;
}

export const categories = [
  { id: "fruits-vegetables", name: "Fruits & Vegetables", icon: "🥦" },
  { id: "dairy-bakery", name: "Dairy & Bakery", icon: "🥛" },
  { id: "staples", name: "Atta, Rice & Dals", icon: "🌾" },
  { id: "snacks", name: "Snacks & Namkeen", icon: "🍿" },
  { id: "beverages", name: "Beverages", icon: "🥤" },
  { id: "personal-care", name: "Personal Care", icon: "🧴" },
  { id: "household", name: "Household Needs", icon: "🧹" },
  { id: "spices", name: "Masala & Spices", icon: "🌶️" },
];

export const products: Product[] = [
  { id: "p1", name: "Fresh Tomatoes", category: "fruits-vegetables", subCategory: "Vegetables", brand: "Farm Fresh", price: 28, mrp: 35, unit: "500 g", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", rating: 4.2, reviewCount: 214, stock: 120, description: "Farm-fresh, juicy red tomatoes, hand-picked for quality. Perfect for curries, salads and chutneys.", tags: ["vegetable", "fresh"], isVeg: true },
  { id: "p2", name: "Banana Robusta", category: "fruits-vegetables", subCategory: "Fruits", brand: "Farm Fresh", price: 45, mrp: 50, unit: "1 dozen", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", rating: 4.5, reviewCount: 341, stock: 90, description: "Naturally ripened Robusta bananas, rich in potassium and energy.", tags: ["fruit", "fresh"], isVeg: true },
  { id: "p3", name: "Amul Toned Milk", category: "dairy-bakery", subCategory: "Milk", brand: "Amul", price: 27, mrp: 27, unit: "500 ml pouch", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", rating: 4.7, reviewCount: 980, stock: 200, description: "Fresh toned milk, pasteurized and homogenized. Rich source of calcium.", tags: ["dairy"], isVeg: true },
  { id: "p4", name: "Britannia Brown Bread", category: "dairy-bakery", subCategory: "Bakery", brand: "Britannia", price: 45, mrp: 50, unit: "400 g", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", rating: 4.3, reviewCount: 512, stock: 75, description: "Soft, wholesome brown bread made with 100% whole wheat.", tags: ["bakery"], isVeg: true },
  { id: "p5", name: "India Gate Basmati Rice", category: "staples", subCategory: "Rice", brand: "India Gate", price: 320, mrp: 380, unit: "5 kg", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", rating: 4.6, reviewCount: 1204, stock: 60, description: "Extra-long grain premium basmati rice, aged for authentic aroma.", tags: ["staple", "rice"], isVeg: true },
  { id: "p6", name: "Aashirvaad Atta", category: "staples", subCategory: "Atta", brand: "Aashirvaad", price: 265, mrp: 290, unit: "5 kg", image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=400", rating: 4.7, reviewCount: 1890, stock: 100, description: "100% whole wheat atta with natural fibre, for soft rotis.", tags: ["staple", "atta"], isVeg: true },
  { id: "p7", name: "Tata Toor Dal", category: "staples", subCategory: "Dals", brand: "Tata Sampann", price: 165, mrp: 180, unit: "1 kg", image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", rating: 4.4, reviewCount: 645, stock: 85, description: "Unpolished, naturally processed toor dal rich in protein.", tags: ["staple", "dal"], isVeg: true },
  { id: "p8", name: "Lay's Classic Salted", category: "snacks", subCategory: "Chips", brand: "Lay's", price: 20, mrp: 20, unit: "52 g", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", rating: 4.5, reviewCount: 2310, stock: 300, description: "Crispy potato chips with the perfect touch of salt.", tags: ["snack", "chips"], isVeg: true },
  { id: "p9", name: "Haldiram's Aloo Bhujia", category: "snacks", subCategory: "Namkeen", brand: "Haldiram's", price: 55, mrp: 60, unit: "200 g", image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400", rating: 4.6, reviewCount: 890, stock: 150, description: "Crunchy, spicy potato noodles - a classic Indian namkeen.", tags: ["snack", "namkeen"], isVeg: true },
  { id: "p10", name: "Parle-G Biscuits", category: "snacks", subCategory: "Biscuits", brand: "Parle", price: 10, mrp: 10, unit: "100 g", image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400", rating: 4.8, reviewCount: 5400, stock: 500, description: "India's favourite glucose biscuit, loved across generations.", tags: ["snack", "biscuit"], isVeg: true },
  { id: "p11", name: "Tata Tea Gold", category: "beverages", subCategory: "Tea", brand: "Tata Tea", price: 140, mrp: 155, unit: "500 g", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400", rating: 4.5, reviewCount: 760, stock: 90, description: "Rich, aromatic blend of long leaf tea for the perfect cup.", tags: ["beverage", "tea"], isVeg: true },
  { id: "p12", name: "Nescafe Classic Coffee", category: "beverages", subCategory: "Coffee", brand: "Nescafe", price: 245, mrp: 270, unit: "100 g jar", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400", rating: 4.6, reviewCount: 1120, stock: 70, description: "100% pure instant coffee with a rich, bold aroma.", tags: ["beverage", "coffee"], isVeg: true },
  { id: "p13", name: "Coca-Cola", category: "beverages", subCategory: "Soft Drinks", brand: "Coca-Cola", price: 40, mrp: 40, unit: "750 ml", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", rating: 4.4, reviewCount: 2100, stock: 200, description: "Classic refreshing cola, best enjoyed chilled.", tags: ["beverage", "soft drink"], isVeg: true },
  { id: "p14", name: "Real Fruit Juice - Mixed Fruit", category: "beverages", subCategory: "Juices", brand: "Real", price: 110, mrp: 120, unit: "1 L", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", rating: 4.3, reviewCount: 450, stock: 80, description: "No added preservatives, made from real fruit concentrate.", tags: ["beverage", "juice"], isVeg: true },
  { id: "p15", name: "Colgate Strong Teeth Toothpaste", category: "personal-care", subCategory: "Oral Care", brand: "Colgate", price: 95, mrp: 105, unit: "200 g", image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400", rating: 4.5, reviewCount: 1780, stock: 140, description: "Cavity protection toothpaste with calcium boost formula.", tags: ["personal care", "oral"], isVeg: true },
  { id: "p16", name: "Dove Moisturizing Soap", category: "personal-care", subCategory: "Bath & Body", brand: "Dove", price: 48, mrp: 55, unit: "100 g", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=400", rating: 4.6, reviewCount: 990, stock: 160, description: "With ¼ moisturizing cream for soft, smooth skin.", tags: ["personal care", "soap"], isVeg: true },
  { id: "p17", name: "Head & Shoulders Shampoo", category: "personal-care", subCategory: "Hair Care", brand: "Head & Shoulders", price: 175, mrp: 199, unit: "180 ml", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", rating: 4.4, reviewCount: 670, stock: 95, description: "Anti-dandruff shampoo for clean, healthy-looking hair.", tags: ["personal care", "hair"], isVeg: true },
  { id: "p18", name: "Vim Dishwash Gel", category: "household", subCategory: "Dishwash", brand: "Vim", price: 85, mrp: 95, unit: "500 ml", image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400", rating: 4.5, reviewCount: 830, stock: 130, description: "Lemon-fresh dishwash gel that cuts through grease easily.", tags: ["household", "cleaning"], isVeg: true },
  { id: "p19", name: "Surf Excel Detergent Powder", category: "household", subCategory: "Laundry", brand: "Surf Excel", price: 210, mrp: 235, unit: "1 kg", image: "https://images.unsplash.com/photo-1610557892470-55d587f9deed?w=400", rating: 4.6, reviewCount: 1450, stock: 100, description: "Removes tough stains in a single wash, gentle on fabric.", tags: ["household", "laundry"], isVeg: true },
  { id: "p20", name: "Harpic Toilet Cleaner", category: "household", subCategory: "Cleaning", brand: "Harpic", price: 98, mrp: 110, unit: "1 L", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400", rating: 4.5, reviewCount: 560, stock: 110, description: "Powerful germ-kill formula for a sparkling clean toilet.", tags: ["household", "cleaning"], isVeg: true },
  { id: "p21", name: "MDH Garam Masala", category: "spices", subCategory: "Masala", brand: "MDH", price: 68, mrp: 75, unit: "100 g", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400", rating: 4.7, reviewCount: 920, stock: 140, description: "Authentic blend of aromatic spices for everyday Indian cooking.", tags: ["spices"], isVeg: true },
  { id: "p22", name: "Everest Turmeric Powder", category: "spices", subCategory: "Masala", brand: "Everest", price: 42, mrp: 48, unit: "200 g", image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400", rating: 4.5, reviewCount: 610, stock: 160, description: "Pure, vibrant turmeric powder with natural aroma and colour.", tags: ["spices"], isVeg: true },
  { id: "p23", name: "Fortune Sunflower Oil", category: "staples", subCategory: "Edible Oil", brand: "Fortune", price: 145, mrp: 165, unit: "1 L", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", rating: 4.4, reviewCount: 780, stock: 95, description: "Light, healthy refined sunflower oil for everyday cooking.", tags: ["staple", "oil"], isVeg: true },
  { id: "p24", name: "Tata Salt", category: "staples", subCategory: "Salt & Sugar", brand: "Tata", price: 25, mrp: 28, unit: "1 kg", image: "https://images.unsplash.com/photo-1518110925495-7b60de1c9e42?w=400", rating: 4.6, reviewCount: 1340, stock: 250, description: "Iodised, vacuum-evaporated salt trusted by every household.", tags: ["staple", "salt"], isVeg: true },
  { id: "p25", name: "Maggi 2-Minute Noodles", category: "snacks", subCategory: "Instant Food", brand: "Maggi", price: 56, mrp: 60, unit: "pack of 4", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400", rating: 4.7, reviewCount: 3200, stock: 220, description: "India's favourite masala instant noodles, ready in 2 minutes.", tags: ["snack", "instant"], isVeg: true },
  { id: "p26", name: "Amul Butter", category: "dairy-bakery", subCategory: "Butter & Cheese", brand: "Amul", price: 56, mrp: 58, unit: "100 g", image: "https://images.unsplash.com/photo-1589985270958-bf087b2d8ed7?w=400", rating: 4.8, reviewCount: 1670, stock: 140, description: "Creamy, delicious butter made from fresh cream.", tags: ["dairy"], isVeg: true },
  { id: "p27", name: "Fresh Onions", category: "fruits-vegetables", subCategory: "Vegetables", brand: "Farm Fresh", price: 32, mrp: 38, unit: "1 kg", image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=400", rating: 4.1, reviewCount: 190, stock: 150, description: "Fresh, firm onions - a kitchen essential.", tags: ["vegetable", "fresh"], isVeg: true },
  { id: "p28", name: "Cadbury Dairy Milk", category: "snacks", subCategory: "Chocolates", brand: "Cadbury", price: 45, mrp: 50, unit: "55 g", image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400", rating: 4.7, reviewCount: 2900, stock: 260, description: "Smooth, creamy milk chocolate - a treat for every mood.", tags: ["snack", "chocolate"], isVeg: true },
];

// Ananya General Store delivers only within its home society.
// The store owner can widen this later, but for now it's a single, fixed zone.
export const storeConfig = {
  storeName: "Ananya General Store",
  ownerWhatsApp: "919958882260", // digits only, country code first, no + or spaces
  societyName: "Parsvnath Edens",
  societyArea: "Alpha-2, Greater Noida",
  deliveryMinutes: "10 mins",
};

export const pincodeServiceability: Record<string, { area: string; deliveryMins: string }> = {
  "201308": { area: `${storeConfig.societyName}, ${storeConfig.societyArea}`, deliveryMins: storeConfig.deliveryMinutes },
};

export const deliverySlots = [
  { id: "asap", label: "ASAP (10 mins)", day: "Today" },
];
