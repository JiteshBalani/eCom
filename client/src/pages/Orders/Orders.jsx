import { useEffect, useState } from "react";
import { Card, Spin, Empty, Tag, Divider } from "antd";
import { useUser } from "@clerk/clerk-react";
import { getAllOrders } from "../../api/orders";
import moment from "moment";

const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders(user.id);
      if (response) setOrders(response);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "payment-pending":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Orders</h2>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : orders.length === 0 ? (
        <Empty
          description={<span className="text-xl">No orders found</span>}
          className="py-20"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              title={
                <span className="font-semibold">Order ID: {order._id}</span>
              }
              extra={
                <Tag color={getStatusColor(order.status)}>
                  {order.status.toUpperCase()}
                </Tag>
              }
              className="shadow-md"
            >
              <p className="text-sm text-gray-600 mb-2">
                Placed on:{" "}
                {moment(order.createdAt).format("MMMM Do YYYY, h:mm A")}
              </p>

              <Divider className="my-3" />

              <div className="space-y-4">
                {order.products.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center gap-4 border p-4 rounded-md mb-3"
                  >
                    <img
                      src={product.imageURL}
                      alt={product.productName}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{product.salePrice * product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Divider className="my-3" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Delivery Address:</p>
                  <p className="text-lg text-gray-600">
                    {order.address.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.address.line1}, {order.address.line2 || ""},<br />
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.postalCode}
                    <br />
                    Phone: {order.phone}
                  </p>
                </div>
                <p className="font-bold text-lg">Total: ₹{order.amount}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
