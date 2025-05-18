import { useDispatch, useSelector } from 'react-redux';
import { Card, Image, Button, InputNumber, Row, Col, Divider, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { addProducts, removeProducts, updateQuantity, clearCart } from '../../app/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart);

  const handleQuantityChange = (value, id) => {
  dispatch(updateQuantity({ id, quantity: value }));
  message.success("Quantity updated!");
};

  const handleRemoveItem = (id) => {
    dispatch(removeProducts(id));
    message.success('Item removed from cart!');
  };

  const emptyCart = () => {
    dispatch(clearCart());
    message.success('Cart cleared!');
  }

  const calculateDiscount = (mrp, salePrice) => {
    return Math.round(((mrp - salePrice) / mrp) * 100);
  };

  const subTotal = cartItems.total;
  const deliveryFee = 40;
  // const calculateTotal = () => {
  //   return cartItems.reduce(
  //     (acc, item) => acc + item.salePrice * item.quantity,
  //     0
  //   );
  // };
if(cartItems.products.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
        alt="Empty Cart"
        className="w-100 h-100 object-contain mb-6"
      />
      <h2 className="text-xl font-semibold mb-2">Your cart is empty!</h2>
      <p className="text-gray-500 mb-4 text-lg">Browse the latest products and add them to your cart.</p>
      <Link to='/'><Button type="primary" size="large">
        Continue Shopping
      </Button></Link>
    </div>
  );
  return (
    <div className="max-w-7xl mx-auto p-5 bg-white min-h-screen">
    <div className='flex justify-between items-center p-1'>
      <h1 className="text-3xl font-semibold mb-6 text-center">Your Cart</h1>
      <div onClick={emptyCart} className='cursor-pointer text-xl font-semibold bg-gray-200 border-2 border-red-400 rounded-lg p-2'>Clear the cart</div>
    </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          {cartItems.products.map((item) => (
            <Card key={item._id} className="mb-4 shadow-md" bordered>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={6}>
                  <Image src={item.imageURL[0]} width={100} height={100} style={{ objectFit: 'contain' }} />
                </Col>
                <Col xs={24} sm={18}>
                  <div className="flex flex-col gap-1">
                    <div className="text-lg font-semibold truncate">{item.productName}</div>
                    <div className="text-gray-500">{item.category}</div>
                    <div className="flex gap-3 mt-2 items-center">
                      <span className="text-lg font-semibold text-green-700">₹{item.salePrice}</span>
                      <span className="line-through text-sm text-gray-500">₹{item.mrp}</span>
                      <span className="text-sm text-amber-600 font-semibold">{calculateDiscount(item.mrp, item.salePrice)}% OFF</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span>Quantity:</span>
                      <InputNumber
                        min={1}
                        max={item.stock || 10}
                        value={item.quantity}
                        onChange={(value) => handleQuantityChange(value, item._id)}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-3 text-right font-medium">
                      Total: ₹{item.quantity * item.salePrice}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>

        <Col xs={24} md={8}>
          <Card title="Order Summary" bordered className="sticky top-5 shadow-md">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subTotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery Fee (+)</span>
              <span>₹{deliveryFee}</span>
            </div>
            <Divider />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{subTotal + deliveryFee}</span>
            </div>
            <Link to='/checkout'>
              <Button type="primary" block className="mt-4">
              Proceed to Checkout
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;