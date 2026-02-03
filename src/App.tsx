import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound";
import { RootLayout } from "./layouts/RootLayout";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <RedirectIfAuthenticated>
            <AuthPage />
          </RedirectIfAuthenticated>
        ),
      },
      { path: "verify", element: <VerifyEmail /> },
      {
        path: "tweet/:tweet_id",
        element: (
          <ProtectTweetDetail>
            <TweetDetailPage />
          </ProtectTweetDetail>
        ),
      },

      // ✅ Bọc các route cần HomeLayout ở đây
      {
        element: (
          <RedirectIfNotAuthenticated>
            <HomeLayout />
          </RedirectIfNotAuthenticated>
        ),
        children: [
          { path: "home", element: <HomePage /> },
          { path: "bookmarks", element: <BookmarkPage /> },
          { path: "explore", element: <ExplorePage /> },
          { path: "notifications", element: <NotificationPage /> },
          { path: "messages", element: <MessagePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "communities", element: <CommunitiesPage /> },
          { path: `communities/t/${joined_tab}`, element: <CommunitiesPage /> },
          {
            path: `communities/t/${explore_tab}`,
            element: <CommunitiesPage />,
          },
          { path: "communities/:slug", element: <CommunityPage /> },
          { path: "trending", element: <TrendingPage /> },
          {
            path: `:username/${following_tab}`,
            element: <FollowersFollowing />,
          },
          {
            path: `:username/${followers_tab}`,
            element: <FollowersFollowing />,
          },
          { path: ":username", element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <main
      className="min-h-screen w-full bg-[#efebeb] 
     bg-[radial-gradient(circle_at_90%_90%,_#88bcf3_0%,_rgba(255,255,255,0)_60%)]"
    >
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
