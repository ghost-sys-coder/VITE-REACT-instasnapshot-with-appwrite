import { Outlet } from "react-router-dom";
import { BottomBar, LeftBar, Topbar } from "@/components/shared";

const RootLayout = () => {
    return (
        <div className="w-full md:flex">
            <Topbar />
            <LeftBar />
            <section className="flex flex-1 h-full">
                <Outlet />
            </section>
            <BottomBar />
        </div>
    )
}

export default RootLayout;