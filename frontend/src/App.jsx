import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Cart from "./pages/Cart";
import AuthProvider, { useAuth } from "./AuthContext";  // ✅ garde cette seule ligne
import "./styles.css";
import AdminDashboard from "./pages/admin/AdminDashboard"; // ✅ unique page admin
import Checkout from './pages/Checkout';
import Profile from "./pages/Profile";

function Private({ children }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="container">Chargement…</div>;
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Chargement…</div>;
  return user && user.is_staff ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/cart" element={<Private><Cart /></Private>} />
          <Route path="/checkout" element={<Private><Checkout /></Private>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />

          {/* Admin unique */}
          <Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
