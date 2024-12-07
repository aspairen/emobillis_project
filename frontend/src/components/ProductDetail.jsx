import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams(); // Grab the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        price: parseFloat(product.price),//Ensure price is a number
        quantity:1, //Default quantity
      })
    }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/shop/products/${id}/`);
        setProduct(response.data); // Set the single product data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // The effect runs again if the product ID changes (e.g., if a user navigates to another product)

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="container my-4">
      <button className='btn btn-secondary mb-3' onClick={() => navigate('/')}>
        Back to Products
      </button>
      
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image || "https://via.placeholder.com/500"}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
        <h1 className="text-center mb-4">{product.name}</h1>          
          <p>{product.description}</p>
          <p className="text-success">Price: ${parseFloat(product.price).toFixed(2)}
          </p>
          <p>Stock: {product.stock}</p>
          <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;