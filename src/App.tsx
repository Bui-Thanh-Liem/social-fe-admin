import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";
import { RedirectIfNotAuthenticated } from "./components/RedirectIfNotAuthenticated";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Setup2FaPage } from "./pages/auth/Setup2FaPage";
import { BadWordsPage } from "./pages/management/bad-wrods-page/BadWordsPage";
import { CommunityPage } from "./pages/management/community-page/CommunityPage";
import { HomePage } from "./pages/management/home-page/HomePage";
import { MediaPage } from "./pages/management/media-page/MediaPage";
import { TweetPage } from "./pages/management/tweet-page/TweetPage";
import { UserPage } from "./pages/management/user-page/UserPage";
import { LoginPage } from "./pages/auth/LoginPage";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: (
          <RedirectIfAuthenticated>
            <AuthLayout />
          </RedirectIfAuthenticated>
        ),
        children: [
          {
            path: "login",
            index: true,
            element: <LoginPage />,
          },
          {
            path: "/setup-2fa",
            element: <Setup2FaPage />,
          },
        ],
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
          {
            path: "/management/bad-words",
            element: <BadWordsPage />,
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
