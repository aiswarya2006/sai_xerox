import UserDashboard from "./user/UserDashboard";
import OrderUpload from "./user/OrderUpload";

function App() {
  const path = window.location.pathname;
  if (path === "/order") {
    return <OrderUpload />;
  }
  return <UserDashboard />;
}

export default App;
