import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth("actions");

    function handleSubmit(event) {
        event.preventDefault();
        if (!isLoading) {
            setIsLoading(true);
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
            console.log('API Base URL:', apiBaseUrl); // Verifica que la URL esté correctamente definida

            fetch(`${apiBaseUrl}api-auth/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: usernameRef.current.value,
                    password: passwordRef.current.value,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("No se pudo iniciar sesión");
                    }
                    return response.json();
                })
                .then((responseData) => {
                    login(responseData.token);
                    if (responseData.token) {
                        fetch(`${apiBaseUrl}users/profiles/profile_data/`, {
                            method: "GET",
                            headers: {
                                Authorization: `Token ${responseData.token}`,
                            },
                        })
                            .then((profileResponse) => {
                                if (!profileResponse.ok) {
                                    throw new Error("Error al obtener perfil");
                                }
                                return profileResponse.json();
                            })
                            .then((profileData) => login(responseData.token, profileData.user__id))
                            .catch((error) => {
                                console.error("Error al obtener perfil", error);
                                setIsError(true);
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error al iniciar sesión", error);
                    setIsError(true);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-4">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="username">Nombre de usuario:</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="text"
                                    id="username"
                                    name="username"
                                    ref={usernameRef}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-user"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="password">Contraseña:</label>
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="password"
                                    id="password"
                                    name="password"
                                    ref={passwordRef}
                                />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-lock"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button
                                    type="submit"
                                    className="button is-primary is-fullwidth"
                                >
                                    {isLoading ? "Cargando..." : "Enviar"}
                                </button>
                                {isError && <p>Error al iniciar sesión.</p>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;
