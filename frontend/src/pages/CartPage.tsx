import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateSize,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const navigate = useNavigate();

  // Available sizes for shoes
  const availableSizes = ["6", "7", "8", "9", "10", "11", "12"];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayNow = async () => {
    const amount = getCartTotal();
    if (amount <= 0) return;

    // Debug: Log environment variables
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

    // Always use backend URL when on Vercel, localhost for development
    const API_URL = window.location.hostname.includes("vercel.app")
      ? "https://vercalpacket1.vercel.app"
      : import.meta.env.VITE_API_URL || "http://localhost:5000";

    console.log("Using API_URL:", API_URL);

    try {
      const res = await fetch(`${API_URL}/api/payment/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Payment response:", data); // Debug log

      // Check if the response has the expected structure
      if (!data.success || !data.order || !data.order.id) {
        throw new Error("Invalid order response from server");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_B0ltWrdDwTjibk",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "PUMA Store",
        description: "Order Payment",
        order_id: data.order.id,
        handler: function (response) {
          alert(
            "Payment successful! Payment ID: " + response.razorpay_payment_id
          );
          // You can add further logic here, like redirecting to a success page
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#d90429",
        },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err); // Debug log
      alert("Payment failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Your Shopping Cart
          </h1>

          {getCartItemCount() === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="p-6 flex items-center justify-between space-x-6"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{item.price.toFixed(2)}
                        </p>
                        {/* Size Display and Selection */}
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">
                            Size: {item.size}
                          </p>
                          <div className="flex space-x-1">
                            {availableSizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => updateSize(item.id, size)}
                                className={`px-2 py-1 text-xs border rounded transition-all duration-200 ${
                                  item.size === size
                                    ? "border-brand-red bg-brand-red text-white"
                                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.size
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.size
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold text-gray-800">Total:</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{getCartTotal().toFixed(2)}
                  </p>
                </div>
                <Button className="w-full mt-6 text-lg" onClick={handlePayNow}>
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
