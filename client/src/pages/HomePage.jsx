import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/store';
import ProductCard from '../Components/ProductCard';
import FashionImage from '../assets/fashion.jpg';
import TshirtImage from '../assets/Tshirt.jpg';
import JeansImage from '../assets/jeans.jpg';
import ShoesImage from '../assets/shoes.jpg';

const HomePage = () => {
  const { featuredProducts, fetchProducts, categories } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Map categories to their specific images
  const categoryImages = {
    't-shirts': TshirtImage,
    'jeans': JeansImage,
    'shoes': ShoesImage
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <img 
          src={FashionImage} 
          alt="Fashion Collection" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <img src={FashionImage} alt="Fashion Collection" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        </div>
        <div className="container mx-auto relative z-10 px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">New Summer Collection</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the latest trends in fashion with our premium collection of T-shirts, jeans, and shoes
          </p>
          <Link 
            to="/products" 
            className="bg-purple-700 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/products/${category}`}
                className="relative group overflow-hidden rounded-xl shadow-lg h-80"
              >
                {/* Category-specific background image */}
                <img
                  src={categoryImages[category]}
                  alt={`${category} collection`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-40 group-hover:bg-opacity-30 transition border-2 border-purple-700"></div>
                <div className="absolute inset-0 flex justify-center">
                  <h3 className="text-4xl font-bold text-stone-900 capitalize">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-purple-700 hover:underline">
              View All Products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Summer Sale - Up to 50% Off!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Don't miss our biggest sale of the season. Limited time offer on selected items.
          </p>
          <Link 
            to="/products?sort=discount" 
            className="bg-white text-purple-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Sale Items
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;