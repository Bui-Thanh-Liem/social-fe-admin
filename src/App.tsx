import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";
import { RedirectIfNotAuthenticated } from "./components/RedirectIfNotAuthenticated";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { HomePage } from "./pages/managemant/home-page/HomePage";
import { MediaPage } from "./pages/managemant/media-page/MediaPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserPage } from "./pages/managemant/user-page/UserPage";
import { CommunityPage } from "./pages/managemant/community-page/CommunityPage";
import { TweetPage } from "./pages/managemant/tweet-page/TweetPage";

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
          {
            path: "/management/media",
            element: <MediaPage />,
          },
          {
            path: "/management/users",
            element: <UserPage />,
          },
          {
            path: "/management/tweets",
            element: <TweetPage />,
          },
          {
            path: "/management/communities",
            element: <CommunityPage />,
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

// Tạo Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry 1 lần nếu fail
      refetchOnWindowFocus: false, // Không refetch khi focus lại window
      staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
    },
    mutations: {
      retry: 0, // Không retry mutations
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <RouterProvider router={router} />
      </main>
    </QueryClientProvider>
  );
}

export default App;
