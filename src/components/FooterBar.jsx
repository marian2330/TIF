function FooterBar({ socialNetworks, appName }) {
    return (
        <footer className={`footer is-dark`}>
            <div className="content has-text-centered">
                {socialNetworks.map((socialNetwork) => (
                    <a
                        key={socialNetwork.name}
                        className="icon"
                        href={socialNetwork.url}
                    >
                        <i
                            className={`fab fa-${socialNetwork.name} "has-text-light"`}
                        ></i>
                    </a>
                ))}
                <p className={`has-text-light`}>
                    &copy; {new Date().getFullYear()} {appName}. Todos los
                    derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default FooterBar;
