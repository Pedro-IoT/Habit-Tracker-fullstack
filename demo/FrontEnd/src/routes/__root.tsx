import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from "@/components/Header/Header";
import { Theme } from "@radix-ui/themes";
import "@/styles/global.css";
import { ToastContainer } from "react-toastify";

export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <Theme hasBackground={false}>
                    <ToastContainer position="top-right" autoClose={3000} />
                    <Header />
                    <Outlet />
                    <ReactQueryDevtools />
                    <TanStackRouterDevtools />
                </Theme>
            </>
        )
    }
})