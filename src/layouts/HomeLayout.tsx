import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function HomeLayout() {
  return (
    <div>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
