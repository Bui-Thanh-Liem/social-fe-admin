import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/not-found";
import { RedirectIfAuthenticated } from "./components/redirect-if-authenticated";
import { RedirectIfNotAuthenticated } from "./components/redirect-ff-not-authenticated";
import { AuthLayout } from "./layouts/auth-layout";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { Setup2FaPage } from "./pages/auth/setup-2Fa-page";
import { BadWordsPage } from "./pages/management/bad-wrods-page/badwords-page";
import { CommunityPage } from "./pages/management/community-page/community-page";
import { HomePage } from "./pages/management/home-page/home-page";
import { MediaPage } from "./pages/management/media-page/media-page";
import { TweetPage } from "./pages/management/tweet-page/tweet-page";
import { UserPage } from "./pages/management/user-page/user-page";
import { LoginPage } from "./pages/auth/login-page";

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
