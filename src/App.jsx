import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import RegisterPage from "./pages/register";
import { useEffect, useState } from "react";
import { callFetchAccount } from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/loading";
import NotFound from "./components/notFound";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/protectedRoute";
import LayoutAdmin from "./components/admin/LayoutAdmin";
import UserPage from "./pages/user";
import "./app.scss";
import BookTable from "./components/admin/book/BookTable";
import Order from "./pages/order/Order";
import History from "./pages/history/History";
import { Modal } from "antd";
const Layout = () => {
  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound></NotFound>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "contact",
        element: <ContactPage />,
      },

      { path: "book/:slug", element: <BookPage /> },
      { path: "order", element: <Order /> },
      { path: "history", element: <History /> },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <NotFound></NotFound>,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "book",
        element: <BookTable />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const getAccount = async () => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    )
      return;
    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  return (
    <>
      {isAuthenticated === true ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}
