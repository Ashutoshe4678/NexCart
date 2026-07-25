const seedProducts = [
  // Fruits & Vegetables
  {
    name: "Fresh Organic Bananas",
    category: "Fruits & Vegetables",
    price: 49,
    discountPrice: 39,
    unit: "500g (approx 4-5 pcs)",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
    inStock: 50,
    rating: 4.8,
    deliveryTimeMinutes: 10,
    tags: ["Bestseller", "Organic"]
  },
  {
    name: "Crisp Farm Apples (Shimla)",
    category: "Fruits & Vegetables",
    price: 140,
    discountPrice: 119,
    unit: "4 pcs (approx 600g)",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
    inStock: 35,
    rating: 4.7,
    deliveryTimeMinutes: 8,
    tags: ["Fresh Pick", "Organic"]
  },
  {
    name: "Fresh Tomatoes (Hybrid)",
    category: "Fruits & Vegetables",
    price: 35,
    discountPrice: 28,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80",
    inStock: 60,
    rating: 4.5,
    deliveryTimeMinutes: 10,
    tags: ["Daily Essential"]
  },
  {
    name: "Fresh Spinach (Palak)",
    category: "Fruits & Vegetables",
    price: 30,
    discountPrice: 22,
    unit: "250g bunch",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80",
    inStock: 25,
    rating: 4.6,
    deliveryTimeMinutes: 10,
    tags: ["Farm Fresh"]
  },
  {
    name: "Red Onions",
    category: "Fruits & Vegetables",
    price: 45,
    discountPrice: 38,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8ce?w=500&auto=format&fit=crop&q=80",
    inStock: 80,
    rating: 4.7,
    deliveryTimeMinutes: 10,
    tags: ["Daily Essential"]
  },

  // Dairy & Bakery
  {
    name: "Amul Taaza Toned Milk",
    category: "Dairy & Bakery",
    price: 27,
    discountPrice: 27,
    unit: "500 ml Pouch",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80",
    inStock: 100,
    rating: 4.9,
    deliveryTimeMinutes: 7,
    tags: ["Bestseller", "Essential"]
  },
  {
    name: "Amul Butter - Pasteurised",
    category: "Dairy & Bakery",
    price: 56,
    discountPrice: 54,
    unit: "100g Pack",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80",
    inStock: 45,
    rating: 4.9,
    deliveryTimeMinutes: 8,
    tags: ["Popular"]
  },
  {
    name: "Whole Wheat Sandwich Bread",
    category: "Dairy & Bakery",
    price: 45,
    discountPrice: 40,
    unit: "400g Pack",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    inStock: 30,
    rating: 4.6,
    deliveryTimeMinutes: 10,
    tags: ["Fresh Baked"]
  },
  {
    name: "Fresh Cottage Cheese (Paneer)",
    category: "Dairy & Bakery",
    price: 110,
    discountPrice: 95,
    unit: "200g Pack",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
    inStock: 40,
    rating: 4.8,
    deliveryTimeMinutes: 9,
    tags: ["Protein Rich"]
  },

  // Munchies & Snacks
  {
    name: "Lay's Classic Salted Chips",
    category: "Munchies & Snacks",
    price: 20,
    discountPrice: 20,
    unit: "50g Pack",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    inStock: 75,
    rating: 4.7,
    deliveryTimeMinutes: 8,
    tags: ["Craving"]
  },
  {
    name: "Doritos Nacho Cheese Tortilla",
    category: "Munchies & Snacks",
    price: 50,
    discountPrice: 45,
    unit: "82.5g Pack",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80",
    inStock: 50,
    rating: 4.8,
    deliveryTimeMinutes: 8,
    tags: ["Party Pack"]
  },
  {
    name: "Roasted & Salted Almonds",
    category: "Munchies & Snacks",
    price: 220,
    discountPrice: 189,
    unit: "200g Pack",
    image: "https://images.unsplash.com/photo-1508061252966-173822f3e8f9?w=500&auto=format&fit=crop&q=80",
    inStock: 30,
    rating: 4.9,
    deliveryTimeMinutes: 10,
    tags: ["Healthy Snack"]
  },

  // Cold Drinks & Juices
  {
    name: "Coca-Cola Zero Sugar",
    category: "Cold Drinks & Juices",
    price: 40,
    discountPrice: 38,
    unit: "300ml Can",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
    inStock: 60,
    rating: 4.7,
    deliveryTimeMinutes: 7,
    tags: ["Chilled"]
  },
  {
    name: "Tropicana 100% Orange Juice",
    category: "Cold Drinks & Juices",
    price: 130,
    discountPrice: 110,
    unit: "1 Litre Tetra",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop&q=80",
    inStock: 25,
    rating: 4.6,
    deliveryTimeMinutes: 10,
    tags: ["No Sugar Added"]
  },

  // Instant & Frozen Food
  {
    name: "Maggi 2-Minute Masala Noodles",
    category: "Instant & Frozen",
    price: 56,
    discountPrice: 52,
    unit: "4 Pack (280g)",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80",
    inStock: 90,
    rating: 4.9,
    deliveryTimeMinutes: 8,
    tags: ["Midnight Craving"]
  },
  {
    name: "McCain Crispy French Fries",
    category: "Instant & Frozen",
    price: 145,
    discountPrice: 125,
    unit: "425g Pack",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80",
    inStock: 35,
    rating: 4.7,
    deliveryTimeMinutes: 10,
    tags: ["Frozen Fast"]
  }
];

module.exports = seedProducts;
