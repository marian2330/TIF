import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "@teishi/bulma_theme";
import NavBar from "../components/NavBar";
import FooterBar from "../components/FooterBar";

export default function Layout() {
    return (
        <AuthProvider>
            <div
                className={`hero is-fullheight is-flex is-flex-direction-column`}
            >
                <ThemeProvider>
                    <NavBar appName={"Noticias"} />
                    <Outlet />
                    <FooterBar
                        appName={"Noticias"}
                        socialNetworks={[
                            
                        ]}
                    />
                </ThemeProvider>
            </div>
        </AuthProvider>
    );
}
