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

  // const navItems = [
  //   {
  //     key: "Dark",
  //     label: (
  //       <Segmented
  //         options={[
  //           {
  //             value: "light",
  //             icon: <SunOutlined />,
  //           },
  //           {
  //             value: "dark",
  //             icon: <MoonOutlined />,
  //           },
  //         ]}
  //         value={isDarkMode ? "dark" : "light"}
  //         onChange={(value) => toggleDarkMode(value === "dark")}
  //         style={{
  //           backgroundColor: isDarkMode ? "#333" : "#ddd",
  //           padding: "5px",
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     key: "home",
  //     label: <span onClick={() => navigate("/")}>Home</span>,
  //     icon: <HomeOutlined />,
  //   },
  //   {
  //     key: "orders",
  //     label: <span onClick={() => navigate("/orders")}>My Orders</span>,
  //     icon: <HomeOutlined />,
  //   },
  //   {
  //     key: "cart",
  //     label: <span onClick={() => navigate("/cart")}>Cart</span>,
  //     icon: <ShoppingCartOutlined />,
  //   },
  //   {
  //     key: "user",
  //     label: <UserButton afterSignOutUrl="/login" />,
  //   },
  // ];

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
        const res = await fetch(`/api/user`, {
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
        if (admin && !data.isAdmin) {
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
    <>
      <Layout
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <h1 className="text-2xl font-semibold" onClick={() => navigate("/")}>
            ShopEasy
          </h1>
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
            <span className="cursor-pointer" onClick={() => navigate("/cart")}>
              <Badge count={cartQuantity} color="primary" showZero>
                <ShoppingCartOutlined style={{ fontSize: 25, color: 'white' }}/>
                {/* <span>🛒</span> */}
              </Badge>{" "}
              Cart
            </span>
            <Segmented
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
              value={isDarkMode ? "dark" : "light"}
              onChange={(value) => toggleDarkMode(value === "dark")}
              style={{
                backgroundColor: isDarkMode ? "#333" : "#ddd",
                padding: "5px",
              }}
            />
            <UserButton afterSignOutUrl="/login" />
          </div>
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
    </>
  );
}
