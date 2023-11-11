import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext, INITIAL_USER } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";


const LeftBar = () => {
    const { user, setUser, setIsAuthenticated } = useAuthContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { mutate: signOut } = useSignOutAccount();    

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        signOut();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        navigate("/login")
    }

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-8">
                <Link to="/" className="flex gap-3">
                    <img
                        src="/public/assets/images/logo.svg" alt="logo"
                        width={170}
                        height={36}
                    />
                </Link>
                <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                    <img
                        src={user.imageUrl || '/public/assets/icons/profile-placeholder.svg'}
                        alt="logo"
                        className="h-14 w-14 rounded-full"
                    />
                    <div className="flex flex-col">
                        <p className="body-bold">{user.name}</p>
                        <p className="small-regular text-light-3">@{user.username}</p>
                    </div>
                </Link>
                <ul className="flex flex-col gap-2 group">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;
                        return (
                            <li key={link.label} className={`leftsidebar-link ${isActive && "bg-primary-500"}`}>
                                <NavLink
                                    to={link.route}
                                    className={"flex gap-4 p-4"}
                                >
                                    <img
                                        src={link.imgURL}
                                        alt={link.label}
                                        className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                                    />
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <Button
                variant={"ghost"}
                className="shad-button_ghost"
                onClick={(e)=> handleLogout(e)}
            >
                <img
                    src="/assets/icons/logout.svg" alt="logout"
                />
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftBar