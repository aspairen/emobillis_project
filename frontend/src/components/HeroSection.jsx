const HeroSection = () => {
    return (
      <header
        className="py-5 text-center text-light"
        style={{
          backgroundImage: "url('https://via.placeholder.com/1200x600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h1 className="fw-bold">Welcome to Mechasoko</h1>
          <p className="lead">
            Your one-stop shop for quality products at unbeatable prices.
          </p>
          <a href="/shop" className="btn btn-success btn-lg me-2">
            Shop Now
          </a>
          <a href="/about" className="btn btn-outline-light btn-lg">
            Learn More
          </a>
        </div>
      </header>
    );
  };
  
  export default HeroSection;
  








// const HeroSection = () => {
//     return (
//         <header className="bg-light py-5">
//             <div className="container text-center">
//                 <h1 className="fw-bold text-success">Welcome to Mechasoko</h1>
//                 <p className="lead text-muted">Find everything, the Mechasoko way!</p>
//                 <a href="#" className="btn btn-success btn-lg me-2">Shop Now</a>
//                 <a href="#" className="btn btn-outline-success btn-lg">Learn More</a>
//             </div>
//         </header>
//     );
// };

// export default HeroSection;
