import React, { useState, useEffect } from "react";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./OrdersPage.module.css";
import OrderTable from "../../components/OrderTable/OrderTable";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(authSelector);

  useEffect(() => {
    if (user) {
      getUserOrders();
    }
    // eslint-disable-next-line
  }, [user]);

  // Fetch user orders from firestore
  async function getUserOrders() {
    setLoading(true);
    try {
      const docRef = doc(db, "userOrders", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setOrders([]);
        return toast.error("No Orders Found!");
      }

      const data = docSnap.data();

      const userOrders = data.orders.reverse();
      setOrders(userOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader />;
  }

  return !loading && !orders.length ? (
    <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>
  ) : (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, idx) => {
        // Create an array of product objects from the order object
        const orderProducts = Object.values(order);

        // Remove the date field, as it's not a product
        const products = orderProducts.filter(
          (item) => typeof item === "object"
        );
        const orderDate = order.date;

        return (
          <OrderTable
            key={idx}
            orderProducts={products}
            orderDate={orderDate}
          />
        );
      })}
    </div>
  );
};

export default OrdersPage;
