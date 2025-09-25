import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { authSelector, signInUser } from "../../redux/reducers/authReducer";

const LoginPage = () => {
  const { loading, user } = useSelector(authSelector);
  const dispatch = useDispatch();
  const auth = getAuth();
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }

    // function to login the user using redux
    const resultAction = await dispatch(
      signInUser({ auth, email: emailVal, password: passwordVal })
    );

    // If user is authenticated redirect him to home page
    if (signInUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
    // If some error occurs display the error
    else if (signInUser.rejected.match(resultAction)) {
      emailRef.current.value = "";
      passwordRef.current.value = "";
      toast.error(resultAction.payload);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          ref={emailRef}
          className={styles.loginInput}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          ref={passwordRef}
          className={styles.loginInput}
          placeholder="Enter Password"
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
    </div>
  );
};

export default LoginPage;
