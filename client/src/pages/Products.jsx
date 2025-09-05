import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/store';
import ProductCard from '../Components/ProductCard';

const Products = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    price: { min: 0, max: 1000 },
    sizes: [],
    colors: []
  });

  const { products, fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products by category from URL
  const filteredProducts = category 
    ? products.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      )
    : products;

  // Get all unique sizes/colors for filters
  const uniqueSizes = [...new Set(filteredProducts.flatMap(p => p.sizes || []))];
  const uniqueColors = [...new Set(filteredProducts.flatMap(p => p.colors || []))];

  // Apply filters and sorting
  const filteredSortedProducts = filteredProducts
    .filter(product =>
      product.price >= filters.price.min &&
      product.price <= filters.price.max &&
      (filters.sizes.length === 0 || (product.sizes || []).some(s => filters.sizes.includes(s))) &&
      (filters.colors.length === 0 || (product.colors || []).some(c => filters.colors.includes(c)))
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest first
    });

  return (
    <div className="pt-32 pb-16"> {/* Increased padding-top to account for fixed header */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Filters</h3>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2">Price Range</h4>
              <div className="flex justify-between mb-2">
                <span>${filters.price.min}</span>
                <span>${filters.price.max}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.price.max}
                onChange={e => setFilters({ ...filters, price: { ...filters.price, max: Number(e.target.value) } })}
                className="w-full"
              />
            </div>

            {/* Size Filter */}
            {uniqueSizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {uniqueSizes.map(size => (
                    <button
                      key={size}
                      className={`border px-3 py-1 rounded ${
                        filters.sizes.includes(size)
                          ? 'bg-purple-700 text-white border-purple-700'
                          : 'border-gray-300'
                      }`}
                      onClick={() => setFilters({
                        ...filters,
                        sizes: filters.sizes.includes(size)
                          ? filters.sizes.filter(s => s !== size)
                          : [...filters.sizes, size]
                      })}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {uniqueColors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border ${
                        filters.colors.includes(color)
                          ? 'ring-2 ring-offset-2 ring-purple-500'
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFilters({
                        ...filters,
                        colors: filters.colors.includes(color)
                          ? filters.colors.filter(c => c !== color)
                          : [...filters.colors, color]
                      })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Display */}
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold capitalize">
                {category ? `${category}` : 'All Products'}
              </h2>
              <div className="flex items-center space-x-4">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : filteredSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSortedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;