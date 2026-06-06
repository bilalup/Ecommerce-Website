import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '../store/store';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCartStore();
  const serverApi = import.meta.env.VITE_SERVER_API;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${serverApi}/products/getOneProduct/${id}`);
        const mainProduct = res.data.product;

        setProduct(mainProduct);

        if (mainProduct?.category) {
          const all = await axios.get(`${serverApi}/products/getAllProducts`);

          const related = all.data.products
            .filter(p => p.category === mainProduct.category && p._id !== mainProduct._id)
            .slice(0, 4);

          setRelatedProducts(related);
        }

      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ total stock from variants
  const totalStock = useMemo(() => {
    if (!product?.variants) return 0;
    return product.variants.reduce(
      (sum, v) => sum + (Number(v.stock) || 0),
      0
    );
  }, [product]);

  // ✅ FIXED ADD TO CART
  const handleAddToCart = () => {
    if (product?.variants?.length && !selectedVariant) {
      alert("Please select a variant");
      return;
    }

    addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      images: product.images,
      variant: selectedVariant,
      quantity: Number(quantity)
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;
  if (!product) return <div className="pt-24 text-center">Product not found</div>;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* IMAGE */}
          <div>

            <div className="bg-gray-100 rounded-lg p-6">
              <img
                src={product.images?.[0]}
                className="w-full h-96 object-contain"
                alt={product.title}
              />
            </div>

            {/* thumbnails */}
            <div className="flex gap-2 mt-4">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-16 h-16 object-cover border rounded cursor-pointer hover:scale-105"
                  onClick={() => {
                    const newArr = [...product.images];
                    newArr.unshift(newArr.splice(i, 1)[0]);
                    setProduct({ ...product, images: newArr });
                  }}
                />
              ))}
            </div>

          </div>

          {/* INFO */}
          <div>

            <h1 className="text-3xl font-bold">{product.title}</h1>

            <div className="text-2xl text-purple-700 font-bold mt-2">
              ${product.price}
            </div>

            <p className="mt-4 text-gray-700">
              {product.description}
            </p>

            {/* VARIANTS */}
            {product.variants?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Variants</h3>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVariant(v)}
                      className={`border px-3 py-2 rounded transition ${
                        selectedVariant === v
                          ? 'bg-purple-700 text-white'
                          : ''
                      }`}
                    >
                      {v.color} - {v.size} ({v.stock})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="mt-6">
              <h3 className="font-semibold">Quantity</h3>

              <div className="flex items-center mt-2 gap-3">
                <button
                  className="px-3 py-1 border"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  className="px-3 py-1 border"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* STOCK */}
            <div className="mt-4">
              {totalStock > 0
                ? `${totalStock} items in stock`
                : 'Out of stock'}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleAddToCart}
              disabled={totalStock === 0}
              className="mt-6 bg-purple-700 text-white px-6 py-3 rounded w-full"
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>

          </div>
        </div>

        {/* RELATED */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6">Related Products</h2>

          <div className="grid md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <Link key={p._id} to={`/product/${p._id}`} className="border p-3">
                <img
                  src={p.images?.[0]}
                  className="h-40 w-full object-cover"
                />
                <div className="font-semibold">{p.title}</div>
                <div>${p.price}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;