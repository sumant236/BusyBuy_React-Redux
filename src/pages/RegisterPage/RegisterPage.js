import { useRef } from "react";
import { toast } from "react-toastify";
import styles from "./RegisterPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { createUser, authSelector } from "../../redux/reducers/authReducer";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { loading } = useSelector(authSelector);
  const dispatch = useDispatch();
  const auth = getAuth();
  const navigate = useNavigate();

  // Input refs
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const nameVal = nameRef.current.value;
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (
      emailVal === "" ||
      nameVal === "" ||
      passwordVal === "" ||
      passwordVal.length < 6
    ) {
      return toast.error("Please enter valid data!");
    }

    // call the createUser function usig redux here
    const resultAction = await dispatch(
      createUser({
        auth,
        email: emailVal,
        password: passwordVal,
        name: nameVal,
      })
    );

    // If user is authenticated redirect him to home page
    if (createUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
    // If some error occurs display the error
    else if (createUser.rejected.match(resultAction)) {
      nameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
      toast.error(resultAction.payload);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign Up</h2>
        <input
          type="text"
          name="name"
          ref={nameRef}
          placeholder="Enter Name"
          className={styles.loginInput}
        />
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
          {loading ? "..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
