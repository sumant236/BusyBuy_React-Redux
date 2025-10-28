import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import { addDataToCollection } from "../../utils/utils";
import Loader from "../../components/UI/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  productSelector,
  setFilteredProducts,
} from "../../redux/reducers/productsReducer";

function HomePage() {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(75000);
  const [categories, setCategories] = useState({
    mensFashion: false,
    electronics: false,
    jewelery: false,
    womensClothing: false,
  });

  const dispatch = useDispatch();
  const { products, filteredProducts, loading } =
    useSelector(productSelector);

  // Fetch products on app mount
  useEffect(() => {
    addDataToCollection();
    dispatch(getAllProducts());
    // eslint-disable-next-line
  }, []);

  // Rerender the products if the search or filter parameters changez
  useEffect(() => {
    dispatch(
      setFilteredProducts({ searchQuery: query, priceRange, categories })
    );
    // eslint-disable-next-line
  }, [priceRange, categories, query]);

  // Display loader while products are fetching using the Loader Component

  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar
        setPriceRange={setPriceRange}
        setCategories={setCategories}
        priceRange={priceRange}
      />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {loading ? (
        <h1>
          <Loader />
        </h1>
      ) : (
        <ProductList
          products={products ? filteredProducts : null}
          onCart={false}
        />
      )}
    </div>
  );
}

export default HomePage;
