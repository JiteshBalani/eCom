import { Col, Modal, Row, Form, Input, Select, Button, message, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { addProduct } from "../../api/products";

const ProductForm = ({ modalOpen, setModalOpen, onProductUpdate }) => {
  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onFinish = async (values) => {
    console.log(values);
    const response = await addProduct(values);
    onProductUpdate();
    setModalOpen(false);
    message.success("New product added!");
    console.log(response);
  };

  return (
    <Modal open={modalOpen} width={800} footer={null} onCancel={handleCancel}>
      <Form
        layout="vertical"
        style={{ width: "100%" }}
        onFinish={onFinish}
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
                  rules={[
                    { required: true, message: "MRP is required!" },
                  ]}
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
                  rules={[
                    { required: true, message: "Category is required!" },
                  ]}
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
                  initialValue={100}
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
                  initialValue="1 Year Warranty from the date of purchase."
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
                  initialValue={true}
                >
                  <Select
                    id="cod"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                      { value: true, label: "Available" },
                      { value: false, label: "Not Available" }
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
              rules={[{ required: true, message: "Product images are required!" }]}
              getValueFromEvent={(e) => {
                // Split input by commas and trim whitespace
                return e.target.value.split(',').map(url => url.trim()).filter(url => url !== '');
              }}
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
                  initialValue={false}
                >
                  <Select
                    id="featured"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                      { value: false, label: "No" },
                      { value: true, label: "Yes" }
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
            Add Product
          </Button>
          <Button className="mt-3" block onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;