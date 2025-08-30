import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

// This should be moved to a shared file in a real app
const products = [
  {
    id: 1,
    name: "RS-X Reinvention",
    category: "Running",
    price: 110,
    originalPrice: 140,
    rating: 4.5,
    reviews: 128,
    isNew: true,
    isSale: true,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/369579/28/sv01/fnd/PNA/fmt/png/RS-X-Reinvention-Sneakers",
    description:
      "The RS-X Reinvention is a bold, retro-inspired running shoe with modern comfort and style.",
  },
  {
    id: 2,
    name: "Future Z 1.2 FG/AG",
    category: "Football",
    price: 220,
    rating: 4.8,
    reviews: 89,
    isNew: true,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/106476/01/sv01/fnd/PNA/fmt/png/Future-Z-1.2-FG/AG-Soccer-Cleats-Men",
    description:
      "The Future Z 1.2 FG/AG is designed for agility and control on the football field.",
  },
  {
    id: 3,
    name: "Suede Classic XXI",
    category: "Lifestyle",
    price: 75,
    rating: 4.6,
    reviews: 256,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/374915/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Sneakers",
    description:
      "The Suede Classic XXI is a timeless lifestyle sneaker with premium materials.",
  },
  {
    id: 4,
    name: "BMW M Motorsport",
    category: "Motorsport",
    price: 95,
    originalPrice: 120,
    rating: 4.4,
    reviews: 67,
    isSale: true,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/307597/02/sv01/fnd/PNA/fmt/png/BMW-M-Motorsport-Drift-Cat-Decima-Motorsport-Shoes",
    description:
      "BMW M Motorsport shoes combine racing heritage with everyday comfort.",
  },
  {
    id: 5,
    name: "Cali Sport Mix",
    category: "Women",
    price: 85,
    rating: 4.7,
    reviews: 194,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/373908/01/sv01/fnd/PNA/fmt/png/Cali-Sport-Mix-Sneakers-Women",
    description:
      "Cali Sport Mix brings a fresh, feminine twist to classic sport style.",
  },
  {
    id: 6,
    name: "Velocity Nitro 2",
    category: "Running",
    price: 130,
    rating: 4.9,
    reviews: 312,
    isNew: true,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/376261/01/sv01/fnd/PNA/fmt/png/Velocity-Nitro-2-Running-Shoes-Men",
    description:
      "Velocity Nitro 2 is engineered for speed and comfort on every run.",
  },
  {
    id: 7,
    name: "King Pro FG",
    category: "Football",
    price: 180,
    rating: 4.6,
    reviews: 145,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/107255/01/sv01/fnd/PNA/fmt/png/KING-PRO-FG-Soccer-Cleats-Women",
    description:
      "King Pro FG is a legendary football boot for ultimate control.",
  },
  {
    id: 8,
    name: "Thunder Spectra",
    category: "Lifestyle",
    price: 100,
    originalPrice: 130,
    rating: 4.3,
    reviews: 78,
    isSale: true,
    image:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_750,h_750/global/367516/01/sv01/fnd/PNA/fmt/png/Thunder-Spectra-Sneakers",
    description:
      "Thunder Spectra stands out with bold design and vibrant colors.",
  },
];

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Available sizes for shoes
  const availableSizes = ["6", "7", "8", "9", "10", "11", "12"];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }
    if (product) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image || "",
        size: selectedSize,
      });
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size before buying");
      return;
    }
    if (product) {
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: product.image || "",
        size: selectedSize,
      });
      navigate("/cart");
    }
  };

  if (!product) {
    return <div className="text-center py-20 text-2xl">Product not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden shadow-lg bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
          <div className="text-gray-500 uppercase text-xs tracking-wider">
            {product.category}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-brand-red">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">
              {"★".repeat(Math.floor(product.rating))}
            </span>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>
          <p className="text-gray-700 mt-4">{product.description}</p>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Select Size
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg text-center transition-all duration-200 ${
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
              <p className="text-sm text-gray-600 mt-2">
                Selected size:{" "}
                <span className="font-semibold">{selectedSize}</span>
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={!selectedSize ? "opacity-50 cursor-not-allowed" : ""}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className={!selectedSize ? "opacity-50 cursor-not-allowed" : ""}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
