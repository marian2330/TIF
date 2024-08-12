import appLogo from "../assets/Logo.png";
import NavMenu from "./NavMenu";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

function NavBar({ appName }) {
    const { isAuthenticated, token } = useAuth("state");
    const { logout } = useAuth("actions");
    const navigate = useNavigate();

    const [profileImage, setProfileImage] = useState(null);

    // Fetch para obtener los datos del perfil del usuario
    const {
        data: userData,
        isLoading: isLoadingProfile,
        isError: isErrorProfile,
        doFetch: fetchProfile,
    } = useFetch(
        `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        }
    );

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        if (userData) {
            setProfileImage(`${import.meta.env.VITE_API_BASE_URL}${userData.image}`);
        }
    }, [userData]);

    const navItems = [
        { text: "Home", url: "/" },
        { text: "Artículos", url: "/articles" },
    ];

    return (
        <header>
            <nav className="navbar has-background-dark" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                        <img src={appLogo} alt="App Logo" />
                        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'white' }}>{appName}</span>
                    </Link>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <NavMenu items={navItems} />

                <div className="navbar-end">
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a>
                            {!isAuthenticated ? (
                                <Link to="/login" className="navbar-item">
                                    <span style={{ marginLeft: '10px', fontWeight: 'bold', color: 'white' }}>Usuario</span>
                                </Link>
                            ) : (
                                profileImage ? (
                                    <div className="navbar-item">
                                        <figure className="image is-48x48">
                                            <img
                                                src={profileImage}
                                                alt="User"
                                                style={{ borderRadius: "50%" }}
                                            />
                                        </figure>
                                    </div>
                                ) : (
                                    <span>No Image Available</span>
                                )
                            )}
                        </a>

                        {isAuthenticated && (
                            <div className="navbar-dropdown is-right">
                                <Link className="navbar-item" to="/profile">
                                    Ver Perfil
                                </Link>
                                <Link className="navbar-item" to="/Createarticles">
                                    Agregar Artículo
                                </Link>
                                <Link className="navbar-item" to="/Delete">
                                    Eliminar Artículo
                                </Link>
                                <a
                                    className="navbar-item"
                                    onClick={() => logout()}
                                >
                                    Cerrar sesión
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
