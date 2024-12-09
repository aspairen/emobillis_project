
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage';
import Footer from './../src/components/Footer'
import ApiProvider from './context/ApiContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider } from "./context/AuthContext"; 
const App = () => {  
    return (
      <ApiProvider>
      <AuthProvider>
      <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/category/:id' element={<CategoryPage />} />
          <Route path='/cart' element={<Cart />}/>
          <Route path='/checkout' element={<CheckoutPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
        </Routes>
        <Footer />
      </Router>
      </CartProvider>
      </AuthProvider>
      </ApiProvider>
    )
};

export default App;
