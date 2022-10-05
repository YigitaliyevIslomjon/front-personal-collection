import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <div className="py-5 px-7">
        <div className="">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
