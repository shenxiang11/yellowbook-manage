import {createBrowserRouter} from "react-router-dom";
import Layout from "./Layout.tsx";
import UserList from "./pages/UserList";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: '/user-list',
                element: <UserList />
            },
        ],
    }
]);
