import { Link, useNavigate } from "react-router-dom"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { Button } from "../ui/button";
import { useAuthContext, INITIAL_USER } from "@/context/AuthContext";

const Topbar = () => {
    const { user, setUser, setIsAuthenticated } = useAuthContext();
    const { mutate: signOut } = useSignOutAccount();
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        signOut();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        navigate("/login")
   }

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to={'/'} className="flex gap-3 items-center">
                    <img
                        src="/assets/images/logo.svg" alt="logo"
                        width={130}
                        height={325}
                    />
                </Link>
                <div className="flex gap-4">
                    <Button variant={"ghost"}
                        className="shad-button_ghost"
                        onClick={(e) => handleLogout(e)}
                    >
                        <img src="/public/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center">
                        <img
                            src={user.imageUrl ||'/assets/images/profile.png'}
                            alt="profile"
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Topbar