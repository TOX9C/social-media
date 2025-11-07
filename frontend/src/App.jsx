import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { socket } from "./socket.js";
import AuthRouter from "./comps/AuthRouter.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Index from "./pages/Index.jsx";
import PostPage from "./pages/PostPage.jsx";
import Search from "./pages/Search.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import Messages from "./pages/Messages.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthRouter>
                <Index />
            </AuthRouter>
        ),
    },
    {
        path: "/messages",
        element: (
            <AuthRouter>
                <Messages />
            </AuthRouter>
        ),
    },
    {
        path: "/search",
        element: (
            <AuthRouter>
                <Search />
            </AuthRouter>
        ),
    },
    {
        path: "/notification",
        element: (
            <AuthRouter>
                <Notifications />
            </AuthRouter>
        ),
    },
    {
        path: "/profile",
        element: (
            <AuthRouter>
                <Profile />
            </AuthRouter>
        ),
    },
    {
        path: "/post/:postId",
        element: (
            <AuthRouter>
                <PostPage />
            </AuthRouter>
        ),
    },
    {
        path: "/profile/:userId",
        element: (
            <AuthRouter>
                <ProfilePage />
            </AuthRouter>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);

const App = () => {
    useEffect(() => {
        socket.connect();
        socket.on("connection", () => {
            console.log("Connected to socket server:", socket.id);
        });
        return () => {
            socket.disconnect();
        };
    }, []);
    return <RouterProvider router={router} />;
};

export default App;
