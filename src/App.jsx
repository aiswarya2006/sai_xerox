// import UserDashboard from "./user/UserDashboard";
// import OrderUpload from "./user/OrderUpload";
// import AdminLogin from "./admin/Adminlogin";
// import AdminOrderPlaced from "./admin/Adminorderplaced";
// import Trackorder from "./user/Trackorder";

// function App() {
//   const path = window.location.pathname;
//   const token = localStorage.getItem("token");

//   if (path === "/order") {
//     return <OrderUpload />;
//   }

//   if (path === "/track-order") {
//     return <Trackorder />;
//   }

//   if (path === "/login") {
//     return <AdminLogin />;
//   }

//   // 🔒 Protect admin page
//   if (path === "/admin/orders") {
//     if (!token) {
//       window.location.href = "/login";
//       return null;
//     }
//     return <AdminOrderPlaced />;
//   }

//   return <UserDashboard />;
// }

// export default App;
import { Routes, Route } from "react-router-dom";

import UserDashboard from "./user/UserDashboard";
import OrderUpload from "./user/OrderUpload";
import Payment from "./user/Payment";
import PaymentComplete from "./user/Payment_complete";
import Trackorder from "./user/Trackorder";

import AdminLogin from "./admin/Adminlogin";
import AdminOrderPlaced from "./admin/Adminorderplaced";
import AdminExpense from "./admin/AdminExpense";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<UserDashboard />} />
      
      <Route path="/order" element={<OrderUpload />} />

      <Route path="/payment" element={<Payment />} />

      <Route path="/payment-complete" element={<PaymentComplete />} />
      
      <Route path="/track-order" element={<Trackorder />} />
      
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Admin Page */}
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminOrderPlaced />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/expense"
        element={
          <ProtectedRoute>
            <AdminExpense />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
