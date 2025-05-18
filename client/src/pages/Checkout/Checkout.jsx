import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, Card, message, Divider } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { clearCart } from "../../app/cartSlice";
import { createNewOrder } from "../../api/orders";
import { setLoading } from "../../app/loaderSlice";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;

  //   const totalAmount = cartItems.reduce(
  //     (acc, item) => acc + item.quantity * item.salePrice,
  //     0
  //   );
  const totalAmount = useSelector((state) => state.cart.total);

  const handleOrder = async (values, paymentMode) => {
    const orderPayload = {
      userId,
      products: cartItems.products.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        productName: item.productName,
        imageURL: item.imageURL[0], // assuming you're using the first image
        salePrice: item.salePrice,
      })),
      amount: totalAmount,
      address: values,
      phone: values.phone,
      status: paymentMode === "cod" ? "pending" : "payment-pending",
    };

    dispatch(setLoading(true));
    try {
      const response = await createNewOrder(orderPayload);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (response) {
        dispatch(clearCart());
        message.success("Order placed successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong while placing the order.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section - Delivery Form */}
        <Card
          className="shadow-md"
          title={<span className="font-semibold">Delivery Information</span>}
        >
          <Form
            layout="vertical"
            onFinish={(values) => handleOrder(values, "cod")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input type="tel" placeholder="9876543210" />
              </Form.Item>
            </div>

            <Form.Item
              label="Address Line 1"
              name="line1"
              rules={[
                { required: true, message: "Please enter address line 1" },
              ]}
            >
              <Input placeholder="123 Main Street" />
            </Form.Item>

            <Form.Item label="Address Line 2" name="line2">
              <Input placeholder="Apt, Suite, etc." />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please enter your city" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: "Please enter your state" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Postal Code"
                name="postalCode"
                rules={[
                  { required: true, message: "Please enter postal code" },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-6">
              <Button
                type="default"
                htmlType="submit"
                // loading={loading}
                className="w-full sm:w-1/2 text-white bg-green-600 hover:bg-green-700"
              >
                Cash on Delivery
              </Button>

              <Button
                type="primary"
                className="w-full sm:w-1/2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() =>
                  message.info("Online payment not yet implemented")
                }
              >
                Pay Online
              </Button>
            </div>
          </Form>
        </Card>

        {/* Right Section - Order Summary */}
        <Card
          className="shadow-md"
          title={<span className="font-semibold">Order Summary</span>}
        >
          <div className="flex flex-col gap-4">
            {cartItems.products.map((item) => (
              <div key={item._id} className="flex items-center gap-4">
                <img
                  src={item.imageURL[0]}
                  alt={item.productName}
                  className="w-16 h-16 object-contain rounded-md border"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm truncate">
                    {item.productName}
                  </h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    ₹{item.salePrice * item.quantity}
                  </p>
                  <p className="text-xs line-through text-gray-400">
                    ₹{item.mrp * item.quantity}
                  </p>
                </div>
              </div>
            ))}
            <Divider />
            <div className="flex justify-between font-semibold text-base">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
