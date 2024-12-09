/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';

const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/shop/products/search/', {
        params: {
          query,
          category,
          min_price: minPrice,
          max_price: maxPrice,
          in_stock: inStock,
        },
      });
      setResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container my-5">
      <h1>Search Products</h1>
      <div className="row">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label htmlFor="inStock" className="ms-2">
            In Stock Only
          </label>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSearch}>
        Search
      </button>

      {error && <div className="text-danger mt-3">{error}</div>}
      <div className="mt-4">
        {results.map((product) => (
          <div key={product.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
              <p className="card-text">Price: ${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
