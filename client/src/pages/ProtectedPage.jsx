import { useAuth, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enable, disable } from "darkreader";
import { Layout, Segmented, Flex, Badge, message } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  SunOutlined,
  MoonOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Drawer, Button, Grid } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function ProtectedPage({ children, admin = false }) {
  const { isLoaded, userId, getToken, isSignedIn } = useAuth();
  // const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

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
          }}
        >
          <h1
            className="text-2xl font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            ShopEasy
          </h1>

          {isMobile ? (
            <>
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
                  <Badge count={cartQuantity} color="blue" showZero>
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
                <UserButton afterSignOutUrl="/login" />
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
            <h3 className="text-lg">
              ShopEasy ©{new Date().getFullYear()} Created by{" "}
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
