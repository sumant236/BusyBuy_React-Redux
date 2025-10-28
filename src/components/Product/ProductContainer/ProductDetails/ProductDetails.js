import React, { useState } from "react";
import styles from "./ProductDetails.module.css";
import { useNavigate } from "react-router-dom";
import MinusIcon from "../../../UI/Icons/MinusIcon";
import PlusIcon from "../../../UI/Icons/PlusIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  removeProductFromCart,
  updateProductQuantity,
} from "../../../../redux/reducers/cartReducer";
import { authSelector } from "../../../../redux/reducers/authReducer";
import { toast } from "react-toastify";
import { getUserCartProducts } from "../../../../utils/utils";

const ProductDetails = ({
  title,
  price,
  productId,
  onCart,
  product,
  quantity,
}) => {
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const [productRemovingFromCart, setProductRemovingCart] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(authSelector);
  const navigate = useNavigate();

  // Function to add product to cart
  const addProductToCart = async () => {
    setProductAddingToCart(true);
    if (!user) {
      navigate("/signin");
      return;
    }
    const resultAction = await dispatch(addProduct({ product, uid: user.uid }));
    if (addProduct.fulfilled.match(resultAction)) {
      toast.success("Product Added Successfully!");
      setProductAddingToCart(false);
    } else if (addProduct.rejected.match(resultAction)) {
      toast.error(resultAction.payload);
      setProductAddingToCart(false);
    }
  };

  // Function to remove the cart
  const removeProduct = async () => {
    setProductRemovingCart(true);
    const resultAction = await dispatch(
      removeProductFromCart({ uid: user.uid, productId })
    );
    if (removeProductFromCart.fulfilled.match(resultAction)) {
      toast.success("Product Removed Successfully!");
      setProductRemovingCart(false);
    } else if (removeProductFromCart.rejected.match(resultAction)) {
      toast.error(resultAction.payload);
      setProductRemovingCart(false);
    }
  };

  // Function for Handling the product quantity increase
  const handleAdd = async () => {
    const { docRef } = await getUserCartProducts(user.uid);
    dispatch(
      updateProductQuantity({
        docRef,
        productId,
        price,
        newQuantity: quantity + 1,
      })
    );
  };

  // Handling the product quantity decrease
  const handleRemove = async () => {
    try {
      const { docRef } = await getUserCartProducts(user.uid);

      if (quantity === 1) {
        removeProduct();
        return;
      }

      dispatch(
        updateProductQuantity({
          docRef,
          productId,
          price: -price,
          newQuantity: quantity - 1,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.productName}>
        <p>{`${title.slice(0, 35)}...`}</p>
      </div>
      <div className={styles.productOptions}>
        <p>₹ {price}</p>
        {onCart && (
          <div className={styles.quantityContainer}>
            <MinusIcon handleRemove={handleRemove} />
            {product.quantity}
            <PlusIcon handleAdd={handleAdd} />
          </div>
        )}
      </div>
      {/* Conditionally Rendering buttons based on the screen */}
      {!onCart ? (
        <button
          className={styles.addBtn}
          title="Add to Cart"
          disabled={productAddingToCart}
          onClick={addProductToCart}
        >
          {productAddingToCart ? "Adding" : "Add To Cart"}
        </button>
      ) : (
        <button
          className={styles.removeBtn}
          title="Remove from Cart"
          onClick={removeProduct}
        >
          {productRemovingFromCart ? "Removing" : "Remove From Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductDetails;
