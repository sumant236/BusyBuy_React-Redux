import React, { useEffect, useState } from "react";
import Loader from "../../components/UI/Loader/Loader";
import ProductList from "../../components/Product/ProductList/ProductList";
import styles from "./CartPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  cartSelector,
  getAllProducts,
  purchaseProducts,
} from "../../redux/reducers/cartReducer";
import { authSelector } from "../../redux/reducers/authReducer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const {
    cart: cartProducts,
    totalPrice,
    loading,
    error,
  } = useSelector(cartSelector);
  const { user } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      dispatch(getAllProducts(user.uid));
    }
  }, [user]);

  const purchaseProductsHandler = async () => {
    setIsPurchasing(true);
    try {
      const result = await dispatch(purchaseProducts(user.uid)).unwrap();
      navigate("/myorders");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {!!cartProducts?.length && (
        <aside className={styles.totalPrice}>
          <p>TotalPrice:- ₹{totalPrice}/-</p>
          <button
            className={styles.purchaseBtn}
            onClick={purchaseProductsHandler}
          >
            {isPurchasing ? "Purchasing" : "Purchase"}
          </button>
        </aside>
      )}
      {!!cartProducts?.length ? (
        <ProductList products={cartProducts} onCart />
      ) : (
        <h1>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
