import { Col, Modal, Row, Form, Input, Select, Button, message, Flex, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { updateProduct, deleteProduct } from "../../api/products";;

const ProductInfo = ({productInfoOpen, setProductInfoOpen, selectedProduct, onProductUpdate}) => {

    const handleOk = () => {
    setProductInfoOpen(false);
  };
  const handleCancel = () => {
    setProductInfoOpen(false);
  };

  const handleChange = (payload) => {
    console.log(`selected ${payload}`);
  };

  const handleDelete = () => {
    console.log(`delete button clicked for ${selectedProduct._id}`)
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        console.log('confirm deleting, now calling api')
        const response = await deleteProduct(selectedProduct._id);
        setProductInfoOpen(false);
        message.success("Product deleted successfully!");
        onProductUpdate();
        console.log(response);
      },
    });
  };

  const onFinish = async (values) => {
    console.log(values);
    const response = await updateProduct(selectedProduct._id, values);
    setProductInfoOpen(false);
    message.success('Changes saved successfully!');
    onProductUpdate();
    console.log(response);
  }
  return (
    <Modal id={selectedProduct?._id} title={selectedProduct?.productName || 'Product Details'}
      open={productInfoOpen}
      width={800}
      footer={null}
      onCancel={handleCancel}
    >
      <Flex
        justify="center"
        align="center"
        gap="small"
        style={{ marginBottom: "20px" }}
      >
        <Button
          danger
          type="primary"
          style={{ fontSize: "1rem", fontWeight: "600" }}
          onClick={handleDelete}
        >
          Delete this product
        </Button>
      </Flex>
      <Form
        layout="vertical"
        style={{ width: "100%" }}
        onFinish={onFinish}
        initialValues={{
          productName: selectedProduct?.productName,
          description: selectedProduct?.description,
          salePrice: selectedProduct?.salePrice,
          mrp: selectedProduct?.mrp,
          category: selectedProduct?.category,
          // Convert array to comma-separated string for display
          imageURL: selectedProduct?.imageURL[0],
          stock: selectedProduct?.stock,
          services: selectedProduct?.services,
          cod: selectedProduct?.cod,
          featured: selectedProduct?.featured,
        }}
      >
        <Row
          gutter={{
            xs: 6,
            sm: 10,
            md: 12,
            lg: 16,
          }}
        >
          <Col span={24}>
            <Form.Item
              label="Product Name"
              htmlFor="productName"
              name="productName"
              className="d-block"
              rules={[{ required: true, message: "Product name is required!" }]}
            >
              <Input
                id="productName"
                type="text"
                placeholder="Enter the product name"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              htmlFor="description"
              name="description"
              className="d-block"
              rules={[{ required: true, message: "Description is required!" }]}
            >
              <TextArea
                id="description"
                rows="4"
                placeholder="Enter the product description"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row
              gutter={{
                xs: 6,
                sm: 10,
                md: 12,
                lg: 16,
              }}
            >
              <Col span={8}>
                <Form.Item
                  label="Sale Price"
                  htmlFor="salePrice"
                  name="salePrice"
                  className="d-block"
                  rules={[
                    { required: true, message: "Sale price is required!" },
                  ]}
                >
                  <InputNumber
                    id="salePrice"
                    style={{ width: "100%" }}
                    placeholder="Enter the sale price"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="MRP"
                  htmlFor="mrp"
                  name="mrp"
                  className="d-block"
                  rules={[{ required: true, message: "MRP is required!" }]}
                >
                  <InputNumber
                    id="mrp"
                    style={{ width: "100%" }}
                    placeholder="Enter the MRP"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Category"
                  htmlFor="category"
                  name="category"
                  className="d-block"
                  rules={[{ required: true, message: "Category is required!" }]}
                >
                  <Select
                    id="category"
                    placeholder="Select category"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                      { value: "Electronics", label: "Electronics" },
                      { value: "Clothing", label: "Clothing" },
                      { value: "Home", label: "Home" },
                      { value: "Beauty", label: "Beauty" },
                      { value: "Sports", label: "Sports" },
                      { value: "Books", label: "Books" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row
              gutter={{
                xs: 6,
                sm: 10,
                md: 12,
                lg: 16,
              }}
            >
              <Col span={8}>
                <Form.Item
                  label="Stock"
                  htmlFor="stock"
                  name="stock"
                  className="d-block"
                >
                  <InputNumber
                    id="stock"
                    style={{ width: "100%" }}
                    placeholder="Enter stock quantity"
                    min={0}
                    max={99999}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Services"
                  htmlFor="services"
                  name="services"
                  className="d-block"
                >
                  <Input
                    id="services"
                    type="text"
                    placeholder="Enter services provided"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Cash On Delivery"
                  htmlFor="cod"
                  name="cod"
                  className="d-block"
                >
                  <Select
                    id="cod"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                      { value: true, label: "Available" },
                      { value: false, label: "Not Available" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Image URLs (Comma separated URLs)"
              htmlFor="imageURL"
              name="imageURL"
              className="d-block"
              rules={[
                { required: true, message: "Product images are required!" },
              ]}
            >
              <TextArea
                id="imageURL"
                rows="3"
                placeholder="Enter image URLs separated by commas"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row
              gutter={{
                xs: 6,
                sm: 10,
                md: 12,
                lg: 16,
              }}
            >
              <Col span={12}>
                <Form.Item
                  label="Featured Product"
                  htmlFor="featured"
                  name="featured"
                  className="d-block"
                >
                  <Select
                    id="featured"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                      { value: false, label: "No" },
                      { value: true, label: "Yes" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            style={{ fontSize: "1rem", fontWeight: "600" }}
          >
            Save all changes
          </Button>
          <Button className="mt-3" block onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProductInfo