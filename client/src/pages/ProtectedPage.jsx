import { useAuth, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enable, disable } from "darkreader";
import { Layout, Segmented, Flex } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  SunOutlined,
  MoonOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

export default function ProtectedPage({ children, adminOnly = false }) {
  const { getToken } = useAuth();
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

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = await getToken();

      const res = await fetch("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    };

    fetchProtectedData();
  }, []);

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
          }}
        >
          <h1 className="text-2xl font-semibold" onClick={() => navigate("/")}>
            ShopEasy
          </h1>
          <div
            className="flex items-center text-lg font-semibold"
            style={{ gap: "2rem" }}
          >
            <span onClick={() => navigate("/")}>
              <HomeOutlined /> Home
            </span>
            <span onClick={() => navigate("/orders")}>
              <OrderedListOutlined /> My Orders
            </span>
            <span onClick={() => navigate("/cart")}>
              <ShoppingCartOutlined /> Cart
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

        <div style={{ padding: 24, flex: "1 0 auto", background: "#fff" }}>
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
