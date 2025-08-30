import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {}
  );
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Available sizes for shoes
  const availableSizes = ["6", "7", "8", "9", "10", "11", "12"];

  // Helper to generate a stable price based on image ID
  const generatePrice = (id: string) => {
    // A simple hash function to get a pseudo-random but consistent number
    const hash = id
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return (Math.abs(hash) % 100) + 50; // Price between ₹50 and ₹150
  };

  const handleSizeSelect = (imageId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [imageId]: size,
    }));
  };

  const handleAddToCart = (image: UnsplashImage) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const selectedSize = selectedSizes[image.id];
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }

    addToCart({
      id: image.id,
      name: image.alt_description || `${categoryName} Shoe`,
      price: generatePrice(image.id),
      image: image.urls.small,
      size: selectedSize,
    });
  };

  const handleBuyNow = (image: UnsplashImage) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const selectedSize = selectedSizes[image.id];
    if (!selectedSize) {
      alert("Please select a size before buying");
      return;
    }

    addToCart({
      id: image.id,
      name: image.alt_description || `${categoryName} Shoe`,
      price: generatePrice(image.id),
      image: image.urls.small,
      size: selectedSize,
    });
    navigate("/cart");
  };

  const handleImageClick = (image: UnsplashImage) => {
    // Navigate to a product details page with the image data
    // For now, we'll navigate to the cart since we don't have individual product pages for Unsplash images
    navigate("/cart");
  };

  useEffect(() => {
    const fetchCategoryImages = async () => {
      if (!categoryName) return;
      setLoading(true);
      const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (!unsplashAccessKey) {
        console.error("Unsplash Access Key is not defined.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${categoryName.toLowerCase()} shoes&per_page=20&client_id=${unsplashAccessKey}`
        );
        const data = await response.json();
        if (data.results) {
          setImages(data.results);
        }
      } catch (error) {
        console.error(`Failed to fetch images for ${categoryName}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryImages();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize text-center">
            {categoryName} Collection
          </h1>

          {loading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading images...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={image.urls.small}
                      alt={image.alt_description}
                      className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity cursor-pointer"
                      onClick={() => handleImageClick(image)}
                    />
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button
                        className="bg-white text-black px-4 py-2 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 rounded"
                        onClick={() => handleImageClick(image)}
                      >
                        QUICK VIEW
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate capitalize">
                      {image.alt_description || `${categoryName} Shoe`}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      ₹{generatePrice(image.id).toFixed(2)}
                    </p>

                    {/* Size Selection */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Select Size
                      </h4>
                      <div className="grid grid-cols-3 gap-1 mb-3">
                        {availableSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(image.id, size)}
                            className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
                              selectedSizes[image.id] === size
                                ? "border-brand-red bg-brand-red text-white"
                                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {selectedSizes[image.id] && (
                        <p className="text-xs text-gray-600 mb-3">
                          Selected:{" "}
                          <span className="font-semibold">
                            {selectedSizes[image.id]}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleAddToCart(image)}
                        disabled={!selectedSizes[image.id]}
                        className={`flex-1 ${
                          !selectedSizes[image.id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBuyNow(image)}
                        disabled={!selectedSizes[image.id]}
                        className={`flex-1 ${
                          !selectedSizes[image.id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && images.length === 0 && (
            <div className="text-center">
              <p className="text-lg text-gray-600">
                No images found for this category.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
