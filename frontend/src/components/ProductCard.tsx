import React, { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isSale?: boolean;
  image?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  originalPrice,
  rating,
  reviews,
  isNew = false,
  isSale = false,
  image,
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Available sizes for shoes
  const availableSizes = ["6", "7", "8", "9", "10", "11", "12"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    addToCart({
      id: String(id),
      name,
      price,
      image: image || "",
      size: selectedSize,
    });
  };

  const handleImageClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Product Image */}
      <div className="aspect-square bg-brand-gray relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onClick={handleImageClick}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer"
            onClick={handleImageClick}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-600">PUMA</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {isNew && (
            <span className="bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {isSale && (
            <span className="bg-brand-red text-white px-2 py-1 text-xs font-semibold rounded">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
          <Heart
            size={16}
            className="text-gray-600 hover:text-brand-red transition-colors duration-200"
          />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button
            className="bg-white text-black px-6 py-2 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
            onClick={handleImageClick}
          >
            QUICK VIEW
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          {category}
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-red transition-colors duration-200">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Size Selection */}
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Select Size
          </h4>
          <div className="grid grid-cols-3 gap-1 mb-3">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
                  selectedSize === size
                    ? "border-brand-red bg-brand-red text-white"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {selectedSize && (
            <p className="text-xs text-gray-600 mb-2">
              Selected: <span className="font-semibold">{selectedSize}</span>
            </p>
          )}
        </div>

        {/* Add to Cart */}
        <div className="pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full ${
              !selectedSize ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
