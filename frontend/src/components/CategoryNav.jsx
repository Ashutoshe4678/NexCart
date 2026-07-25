import React from 'react';
import { Apple, Milk, Cookie, Coffee, Utensils, Sparkles, Grid } from 'lucide-react';

const categories = [
  { id: 'All', label: 'All Items', icon: Grid },
  { id: 'Fruits & Vegetables', label: 'Fruits & Veggies', icon: Apple },
  { id: 'Dairy & Bakery', label: 'Dairy & Bakery', icon: Milk },
  { id: 'Munchies & Snacks', label: 'Munchies & Snacks', icon: Cookie },
  { id: 'Cold Drinks & Juices', label: 'Cold Drinks & Juices', icon: Coffee },
  { id: 'Instant & Frozen', label: 'Instant Meals', icon: Utensils }
];

export default function CategoryNav({ activeCategory, setActiveCategory }) {
  return (
    <div className="category-container">
      <div className="category-scroll">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
