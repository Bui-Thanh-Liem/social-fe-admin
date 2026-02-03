import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import { RedirectIfNotAuthenticated } from "./components/RedirectIfNotAuthenticated";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { HomePage } from "./pages/home-page/HomePage";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "login",
        element: (
          <RedirectIfAuthenticated>
            <AuthLayout />
          </RedirectIfAuthenticated>
        ),
      },
      {
        element: (
          <RedirectIfNotAuthenticated>
            <DashboardLayout />
          </RedirectIfNotAuthenticated>
        ),
        children: [
          {
            index: true,
            element: <HomePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
