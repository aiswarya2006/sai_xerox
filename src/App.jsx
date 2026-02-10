import UserDashboard from "./user/UserDashboard";
import OrderUpload from "./user/OrderUpload";
import AdminLogin from "./admin/Adminlogin";
import AdminOrderPlaced from "./admin/Adminorderplaced";
import Trackorder from "./user/Trackorder";

function App() {
  const path = window.location.pathname;
  if (path === "/order") {
    return <OrderUpload />;
  }
  if (path === "/track-order") {
    return <Trackorder />;
  }
  if (path === "/login") {
    return <AdminLogin />;
  }
  if (path === "/admin/orders") {
    return <AdminOrderPlaced />;
  }
  return <UserDashboard />;
}

export default App;
