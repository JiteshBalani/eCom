import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Badge, Input } from "antd";
import { getAllProducts } from "../../api/products";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch } from 'react-redux';
import { setLoading } from '../../app/loaderSlice';
import Loader from '../../components/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAllProducts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllProducts();
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Something went wrong!");
    }finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchQuery(search);

    if (search.trim() === "") setFilteredProducts(products);
    else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(search)
      );
      setFilteredProducts(filtered);
    }
  };

  const calculateDiscount = (mrp, salePrice) => {
    if (!mrp || !salePrice || mrp <= salePrice) return null;
    const discount = ((mrp - salePrice) / mrp) * 100;
    return Math.round(discount); // rounded to nearest whole number
  };

  return (
    <div
      className="mx-[5%]"
      style={{ fontFamily: "montserrat", height: "100%" }}
    >
      <Loader />
      <div className="text-xl font-semibold mb-2.5 flex flex-col-reverse gap-2 mx-[1%]"
      >
        <span className="text-center">Explore all Products</span>
        <Input
          size="large"
          placeholder="Search a product"
          suffix={<SearchOutlined />}
          style={{
            fontWeight: 400,
            fontSize: "1rem",
            width: "350px", // Fixed width for search bar
          }}
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
      <Row
        className="justify-content-center"
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        {filteredProducts.length > 0 &&
          filteredProducts.map((product) => (
            <Col
              className="gutter-row mb-5 mx-auto"
              key={product._id}
              span={{
                xs: 24,
                sm: 24,
                md: 12,
                lg: 8,
              }}
            >
              <div className="text-center bg-white rounded-md min-h-[400px] max-h-[400px] min-w-[270px] max-w-[270px]">
                <Badge.Ribbon
                  text={product.featured ? "Featured" : ""}
                  color="blue"
                  style={{
                    display: product.featured ? "block" : "none",
                    padding: "5px",
                    fontWeight: 600,
                  }}
                >
                  <img
                    loading="lazy"
                    className="cursor-pointer"
                    src={product.imageURL[0]}
                    alt={product.productName}
                    // width={200}
                    // height={200}
                    style={{
                      width: "300px",
                      height: "300px",
                      objectFit: "contain",
                    }}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                </Badge.Ribbon>
                <h3
                  className="cursor-pointer mt-2 font-semibold text-xl mx-auto truncate whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-[200px]"
                  style={{
                    // fontWeight: 700,
                    // fontSize: "16px",
                    width: "200px",
                    margin: "auto",
                  }}
                >
                  {product.productName}
                </h3>
                <h3 className="cursor-pointer text-md font-semibold text-gray-600">
                  {product.category}
                </h3>
                <h3 className="text-xl text-[#4F39F6] font-semibold">
                  ₹{product.salePrice}{" "}
                  <span className="text-xs line-through text-black">
                    ₹{product.mrp}
                  </span>
                  {/* <span style={{ fontWeight: 300, fontSize: '14px' }}>/ piece</span> */}
                </h3>
                {calculateDiscount(product.mrp, product.salePrice) && (
                  <span className="text-md text-green-700 font-semibold">
                    {calculateDiscount(product.mrp, product.salePrice)}% OFF
                  </span>
                )}
              </div>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default Home;
