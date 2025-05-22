import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Rate, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../api/products';

const RelatedProducts = ({ currentProductId, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getAllProducts();
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (response.success) {
          const filtered = response.data.filter(
            (item) => item.category === category && item._id !== currentProductId
          );
          setRelatedProducts(filtered);
        } else {
          message.error(response.message);
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to load related products.');
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Products in the Same Category</h2>
      <Row gutter={[16, 16]}>
        {relatedProducts.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.productName}
                  src={product.imageURL[0]}
                  style={{ height: '200px', objectFit: 'contain' }}
                />
              }
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <Card.Meta
                title={product.productName}
                description={
                  <>
                    <div>₹{product.salePrice}</div>
                    <Rate disabled defaultValue={product.ratings} />
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RelatedProducts;
