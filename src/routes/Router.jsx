import { createBrowserRouter } from "react-router-dom";

import Home from "../components/Home";
import Login from "../components/Auth/Login";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../components/Profile";
import ArticlesList from "../components/Articles/ArticlesList";
import Articles from "../components/Articles/Articles";
import CreateArticule from "../components/Articles/CreateArticule";
import DeleteArticle from "../components/Articles/DeleteArticle";

const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                index: true, // path: "/"
                element: <Home />,
            },
            
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "articles",
                element: <ArticlesList />,
            },
            {
                path: "/articles/:id",
                element: <Articles />,
            },
            {   path: "/Createarticles",
                element: <CreateArticule />,
            },

            {   path: "/Delete",
                element: <DeleteArticle />,
            },    
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "*",
        element: <h1>Not Found</h1>,
    },
]);

export { Router };
