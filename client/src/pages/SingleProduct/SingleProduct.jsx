import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Row,Col,Card,Button,Rate,Divider,Tag,message,Image,Carousel} from "antd";
import {ShoppingCartOutlined,ThunderboltOutlined,CheckCircleOutlined,} from "@ant-design/icons";
import { addProduct, getProductById } from "../../api/products";
import RelatedProducts from "../RelatedProducts";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../app/loaderSlice';
import Loader from '../../components/Loader';
import { addProducts } from "../../app/cartSlice";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1) ;
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getProductById(id);
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (response.success) {
          setProduct(response.data);
        } else {
          message.error(response.message);
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to load product.");
      } finally {
          dispatch(setLoading(false));
      }
    };
    fetchProduct();
  }, [id]);

  const calculateDiscount = (mrp, salePrice) => {
    if (!mrp || !salePrice || mrp <= salePrice) return null;
    return Math.round(((mrp - salePrice) / mrp) * 100);
  };

  const handleAddToCart = () => {
    dispatch(addProducts({ ...product, quantity}))
    message.success("Added to cart!");
    // your cart logic here
  };

  const parseDescriptionToBullets = (description = "") => {
    if (!description) return [];

    return description
      .split(/[\n•\•\.]/) // Split by newline, bullet, hyphen, or period
      .map((item) => item.trim()) // Trim spaces
      .filter((item) => item.length > 0); // Remove empty strings
  };

  const bullets = parseDescriptionToBullets(product?.description);

  const increaseQuantity = () => {
    if(quantity === 5){
      message.warning("Only 5 units allowed!");
      return;
    }
    setQuantity(quantity+ 1);
  };
  const decreaseQuantity = () => {
    if(quantity === 1) return;
    setQuantity(quantity - 1);
  };

  if (!product)
    return (
      <div className="text-center mt-10 text-lg font-medium">
            <Loader/>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-5 font-montserrat bg-white">
      <Row gutter={[32, 32]} align="middle">
        {/* Image Section */}
        <Col xs={24} md={12}>
          <Image.PreviewGroup>
            <Image
              src={product.imageURL[0]}
              alt={product.productName}
              className="rounded-xl "
              width="100%"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </Image.PreviewGroup>
          {/* <Carousel autoplay>
  {product.imageURL.map((img, index) => (
    <div key={index}>
      <Image
        src={img}
        alt={`Product Image ${index + 1}`}
        className="rounded-xl border"
        width="100%"
        style={{ maxHeight: '500px', objectFit: 'contain' }}
      />
    </div>
  ))}
</Carousel> */}
        </Col>

        {/* Details Section */}
        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-md rounded-xl">
            {/* Product Name */}
            <h2 className="text-2xl font-semibold mb-2">{product.productName}</h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <Rate allowHalf disabled defaultValue={product.ratings || 0} />
              <span className="text-sm text-gray-500">
                ({product.numOfRatings} ratings)
              </span>
            </div>

            {/* Price & Discount */}
            <div className="text-2xl font-semibold text-green-600 mb-1 space-x-2 flex items-center gap-2">
              ₹{product.salePrice}
              {calculateDiscount(product.mrp, product.salePrice) && (
                <Tag color="blue" className="ml-5">
                  {calculateDiscount(product.mrp, product.salePrice)}% OFF
                </Tag>
              )}
            </div>
            <div className="text-sm text-gray-500 line-through">
              MRP: ₹{product.mrp}
            </div>

            {/* Category + Stock */}
            <div className="mt-4 space-y-2 text-base">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium">Stock:</span>{" "}
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </p>
              {product.featured && (
                <Tag color="blue" className="mt-1">
                  Featured Product
                </Tag>
              )}
            </div>

            <Divider />

            {/* Description + Services */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
              <ul className="list-disc ml-5 space-y-1 text-md font-semibold">
                {bullets.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
              <p>
                <CheckCircleOutlined className="text-green-600 mr-1" />
                {product.services}
              </p>
              {product.cod && (
                <p>
                  <Tag color="cyan">Cash on Delivery Available</Tag>
                </p>
              )}
            </div>

            <Divider />

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap mt-2 justify-center">
            <div className="flex justify-around items-center text-xl rounded-lg  bg-gray-200">
              <span onClick={decreaseQuantity} className="px-3 font-bold text-sm cursor-pointer">➖</span>
              <span className="px-3 font-semibold bg-white">{quantity}</span>
              <span onClick={increaseQuantity} className="px-3 font-bold text-sm cursor-pointer">➕</span>
            </div>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                className="bg-blue-600"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                ADD TO CART
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <RelatedProducts
        currentProductId={product._id}
        category={product.category}
      />
    </div>
  );
};

export default SingleProduct;
