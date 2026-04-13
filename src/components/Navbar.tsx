import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  // Hidden admin: press 'A' 3 times quickly
  useEffect(() => {
    const times: number[] = [];
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a") {
        times.push(Date.now());
        // Keep only last 3
        while (times.length > 3) times.shift();
        if (times.length === 3 && times[2] - times[0] < 1000) {
          times.length = 0;
          navigate("/admin");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/properties", label: t("nav.properties") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container-wide flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-foreground">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold">JP</div>
          <span>Jargal</span>
          <span className="text-accent">Properties</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === link.to ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setLang(lang === "en" ? "mn" : "en")}
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            <Globe size={16} />
            {lang === "en" ? "MN" : "EN"}
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium py-2 transition-colors hover:text-accent ${
                  location.pathname === link.to ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setLang(lang === "en" ? "mn" : "en"); setIsOpen(false); }}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent py-2"
            >
              <Globe size={16} />
              {lang === "en" ? "MN" : "EN"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
