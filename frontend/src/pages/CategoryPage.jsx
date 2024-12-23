/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState({ name: "", description: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const placeholderImage = "https://via.placeholder.com/400x250";

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const categoryResponse = await axios.get(`http://127.0.0.1:8000/api/shop/categories/${id}/`);
        const productsResponse = await axios.get(`http://127.0.0.1:8000/api/shop/products/?category=${id}`);
        setCategory(categoryResponse.data);
        setProducts(productsResponse.data.results || []);
        setError(null);
      } catch (err) {
        setError("Failed to load category details.");
        console.error("Error fetching category details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();

    const intervalId = setInterval(fetchCategoryDetails, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">{category.name}</h2>
      <button
        onClick={() => fetchCategoryDetails()}
        className="btn btn-outline-primary my-3"
      >
        Refresh
      </button>
      <p className="text-center text-muted">{category.description}</p>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card border-0 shadow h-100">
              <img
                src={product.image || placeholderImage}
                className="card-img-top"
                alt={product.name}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted flex-grow-1">{product.description}</p>
                <p className="card-text fw-bold text-success">
                  ${product.price.toFixed(2)}
                </p>
                <a href={`/product/${product.id}`} className="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
