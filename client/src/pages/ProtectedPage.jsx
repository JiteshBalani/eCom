import { useAuth, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enable, disable } from "darkreader";
import { Layout, Segmented, Flex, Badge, message, Input } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import { useRef } from "react";
import {
  HomeOutlined,
  SunOutlined,
  MoonOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Drawer, Button, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { getAllProducts } from "../api/products";
import SE_Logo from "../../SE_Logo.png";

export default function ProtectedPage({ children, admin = false }) {
  const { isLoaded, userId, getToken, isSignedIn } = useAuth();
  // const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const searchRef = useRef();

  const navigate = useNavigate();

  const toggleDarkMode = (checked) => {
    if (checked) {
      enable();
      localStorage.setItem("darkMode", "true");
    } else {
      disable();
      localStorage.setItem("darkMode", "false");
    }
    setIsDarkMode(checked);
  };

  <Segmented
    shape="round"
    options={[
      {
        value: "light",
        icon: <SunOutlined />,
      },
      {
        value: "dark",
        icon: <MoonOutlined />,
      },
    ]}
  />;

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      enable();
    } else {
      disable();
    }
  }, [isDarkMode]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log(BACKEND_URL);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoaded) return;

      // If not signed in, redirect to login
      if (!isSignedIn) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user data from your backend
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);

        // Check if admin access is required but user is not admin
        if (admin && !data.admin) {
          message.error("You are not authorized to access this page");
          navigate("/forbidden");
          return;
        }
      } catch (error) {
        console.error("Authentication error:", error);
        message.error("Authentication failed. Please log in again.");
        navigate("/login");
      }
    };

    checkAuth();
  }, [isLoaded, isSignedIn, getToken, navigate, admin]);

  const cartQuantity = useSelector((state) => state.cart.quantity);

  const getProducts = async () => {
    try {
      const response = await getAllProducts();
      if (response.success) {
        setProducts(response.data);
        // setSearchProducts(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      console.error(err);
      message.error(err.message || "Something went wrong!");
    }
  };
  const handleSearch = (e) => {
    const search = e.target.value;
    setSearchQuery(search);
    if (search.trim() === "") return;
    else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(search)
      );
      setSearchProducts(filtered);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchProducts([]);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  console.log(searchProducts);

  return (
    <div className="overflow-hidden">
      <Layout
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            padding: "0 1rem",
            cursor: "pointer",
          }}
        >
          {isMobile ? (
            <img src={SE_Logo} width="40px" onClick={() => navigate("/")}></img>
          ) : (
            <div
              className="flex items-center gap-2 justify-center"
              onClick={() => navigate("/")}
            >
              <img src={SE_Logo} width="40px"></img>
              <h1 className="text-2xl font-semibold cursor-pointer">
                ShopsEasy
              </h1>
            </div>
          )}

          <div className="ml-4 relative w-[280px]" ref={searchRef}>
            <Input
              allowClear
              size="medium"
              placeholder="Search a product"
              suffix={<SearchOutlined />}
              style={{
                fontWeight: 400,
                fontSize: "1rem",
                width: "280px", // Fixed width for search bar
              }}
              onChange={handleSearch}
              value={searchQuery}
            />
            {searchProducts.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md z-50 max-h-72 overflow-y-auto shadow-lg">
                {searchProducts.map((product) => (
                  <div
                    key={product._id}
                    className="px-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchProducts([]);
                      navigate(`/product/${product._id}`);
                    }}
                  >
                    {product.productName}
                  </div>
                ))}
              </div>
            )}
          </div>
          {isMobile ? (
            <>
              <Button
                type="text"
                icon={<SearchOutlined />}
                onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
                className="text-white"
              />
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ color: "white" }}
              />
              <Drawer
                title="Menu"
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                bodyStyle={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/");
                    setDrawerOpen(false);
                  }}
                >
                  🏠 Home
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/orders");
                    setDrawerOpen(false);
                  }}
                >
                  📦 My Orders
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/cart");
                    setDrawerOpen(false);
                  }}
                >
                  <Badge count={cartQuantity} color="red" showZero>
                    🛒 Cart
                  </Badge>
                </span>
                <Segmented
                  options={[
                    { value: "light", icon: <SunOutlined /> },
                    { value: "dark", icon: <MoonOutlined /> },
                  ]}
                  value={isDarkMode ? "dark" : "light"}
                  onChange={(value) => toggleDarkMode(value === "dark")}
                />
                <UserButton afterSignOutUrl="/login"/>
              </Drawer>
            </>
          ) : (
            <div
              className="flex items-center text-lg font-semibold"
              style={{ gap: "2rem" }}
            >
              <span className="cursor-pointer" onClick={() => navigate("/")}>
                <HomeOutlined /> Home
              </span>
              <span
                className="cursor-pointer"
                onClick={() => navigate("/orders")}
              >
                <OrderedListOutlined /> My Orders
              </span>
              <span
                className="cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <Badge count={cartQuantity} color="primary" showZero>
                  <ShoppingCartOutlined
                    style={{ fontSize: 25, color: "white" }}
                  />
                </Badge>{" "}
                Cart
              </span>
              <Segmented
                options={[
                  { value: "light", icon: <SunOutlined /> },
                  { value: "dark", icon: <MoonOutlined /> },
                ]}
                value={isDarkMode ? "dark" : "light"}
                onChange={(value) => toggleDarkMode(value === "dark")}
                style={{
                  backgroundColor: isDarkMode ? "#333" : "#ddd",
                  padding: "5px",
                }}
              />
              <UserButton afterSignOutUrl="/login" />
            </div>
          )}
        </Header>

        <div className="bg-gray-100" style={{ padding: 24, flex: "1 0 auto" }}>
          {children}
        </div>

        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#001529",
            color: "white",
          }}
        >
          <Flex justify="center" align="center" gap="middle">
            <img src={SE_Logo} width="40px"></img>
            <h3 className="text-lg">
              ShopsEasy ©{new Date().getFullYear()} Created by{" "}
              <span
                className="text-xl font-semibold cursor-pointer"
                style={{ color: "#8AB9F9" }}
                onClick={() =>
                  window.open("https://github.com/JiteshBalani", "_blank")
                }
              >
                Jitesh Balani
              </span>
            </h3>
          </Flex>
        </Footer>
      </Layout>
    </div>
  );
}
