import {useState, useEffect} from 'react';
import {getAllProducts} from '../../api/products';
import { Button, Input, Table } from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import ProductForm from './ProductForm';
import ProductInfo from './ProductInfo';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../app/loaderSlice';
import Loader from '../../components/Loader';

const Admin = () => {
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ selectedProduct, setSelectedProduct] = useState(null);
  const [productInfoOpen, setProductInfoOpen] = useState(false)

  const dispatch = useDispatch();

  const getData = async() => {
    dispatch(setLoading(true));
    try{
      const response = await getAllProducts();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const allProducts = response?.data || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    }catch(err){
      setError(err);
      console.log('Failed to fetch the products.', err);
    }finally{
    dispatch(setLoading(false));
    }
  };

  const handleSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setSearchQuery(search);

    if(search.trim() === '') setFilteredProducts(products);
    else{
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(search));
      setFilteredProducts(filtered)
    }
  };

  const onProductUpdate = async() => {
    await getData()
  };

  useEffect(() => {
    getData();
  }, [])

  const tableHeadings = [
    {
      title: 'Images',
      dataIndex: 'imageURL',
      render: (imageURLs, product) => {
        // Display first image from the array
        return imageURLs && imageURLs.length > 0 ? (
          <img 
            src={imageURLs[0]} 
            width="75" 
            height="115" 
            alt={product.productName} 
            style={{objectFit: "cover", display: "block"}}
          />
        ) : (
          <div style={{width: "75px", height: "115px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center"}}>
            No image
          </div>
        );
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Price(₹)',
      dataIndex: 'salePrice'
    },
    {
      title: "Category",
      dataIndex: 'category',
    },
    {
      title: "Stock",
      dataIndex: 'stock'
    },
  ]

  return (
    <>
    <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
            }}>
                <Input 
                    size="small" 
                    placeholder='Search a product' 
                    suffix={<SearchOutlined />}
                    style={{
                        fontWeight: 300, 
                        fontSize: "1rem",
                        width: '250px'  // Fixed width for search bar
                    }}
                    onChange={handleSearch}
                    value={searchQuery}
                />
                <Button type='primary' style={{fontWeight:600}} 
                  onClick={() => {
                    setModalOpen(true);
                }}>
                    Add Product
                </Button>
                
            </div>

    {/* add product modal */}
    { modalOpen && <ProductForm modalOpen={modalOpen} setModalOpen={setModalOpen} onProductUpdate={onProductUpdate} /> }

    <Loader/>

    <Table columns={tableHeadings} 
            dataSource={filteredProducts}
            rowKey="_id"
            className='cursor-pointer'
            onRow={(record) => ({
              onClick: () => {
                setSelectedProduct(record);
                setProductInfoOpen(true);
              }
            })}
    />

    {/* update movie modal */}
    { productInfoOpen && <ProductInfo 
      productInfoOpen={productInfoOpen} 
      setProductInfoOpen={setProductInfoOpen} 
      selectedProduct={selectedProduct} 
      onProductUpdate={onProductUpdate} /> }
    </>
  )
}

export default Admin