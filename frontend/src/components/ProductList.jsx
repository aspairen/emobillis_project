import { useState, useEffect } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/shop/products/");
        setProducts(response.data.results);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const handleImageError = (event) => {
    event.target.src = "http://127.0.0.1:8000/media/products/default_image_temp.jpeg";
  }
  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold mb-4">Our Products</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card border-0 shadow h-100">
              <img
                src={`${product.image.startsWith("http") ? "" : "http://127.0.0.1:8000/"}${product.image}`}
                className="card-img-top"
                alt={product.name}
                style={{ height: "250px", objectFit: "cover" }}
                onError={handleImageError}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted flex-grow-1">{product.description}</p>
                <p className="card-text fw-bold text-success">
                  ${isNaN(product.price) ? "N/A" : parseFloat(product.price).toFixed(2)}
                </p>
                <a href={`/product/${product.id}`} className="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;

