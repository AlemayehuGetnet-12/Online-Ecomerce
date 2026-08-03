import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-1 mb-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-base sm:text-lg font-bold text-blue-600">
            ${product.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;