// // eslint-disable-next-line no-unused-vars
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch categories from the backend
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/shop/categories/"); // Replace with your backend endpoint
//         if (Array.isArray(response.data.results)) {
//           const categoriesData = response.data.results.map((item) => ({
//             id: item.id,
//             name: item.name,
//             description: item.description || "No description available.",
//             image: item.image, // Use `item.image` directly as it's returned by the backend
//             link: `/category/${item.id}`, // Generate link dynamically
//           }));
//           setCategories(categoriesData);
//         } else {
//           setCategories([]); // Fallback if response is invalid
//           console.error("Invalid response format:", response.data);
//         }
//       } catch (err) {
//         setError("Failed to load categories.");
//         console.error("Error fetching categories:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Render loading, error, or category cards
//   return (
//     <section className="py-5">
//       <div className="container">
//         <h2 className="text-center fw-bold mb-4">Explore Categories</h2>

//         {loading ? (
//           <div className="text-center">Loading...</div>
//         ) : error ? (
//           <div className="text-center text-danger">{error}</div>
//         ) : (
//           <div className="row g-4">
//             {categories.map((category, index) => (
//               <div className="col-md-4" key={index}>
//                 <a href={category.link || "#"} className="text-decoration-none text-dark">
//                   <div className="card shadow border-0">
//                     <img
//                       src={category.image || "https://via.placeholder.com/400x250"} // Fallback to placeholder
//                       className="card-img-top"
//                       alt={category.name}
//                       style={{ height: "250px", objectFit: "cover" }}
//                     />
//                     <div className="card-body text-center">
//                       <h5 className="card-title">{category.name}</h5>
//                       <p className="card-text text-muted">{category.description}</p>
//                     </div>
//                   </div>
//                 </a>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Categories;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const placeholderImage = "https://via.placeholder.com/400x250";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/shop/categories/");
        setCategories(response.data.results || []);
        setError(null);
      } catch (err) {
        setError("Failed to load categories.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-4">Explore Categories</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : (
          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-md-4" key={category.id}>
                <Link to={`/category/${category.id}`} className="text-decoration-none text-dark">
                  <div className="card shadow border-0">
                    <img
                      src={category.image || placeholderImage}
                      className="card-img-top"
                      alt={category.name}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{category.name}</h5>
                      <p className="card-text text-muted">{category.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
