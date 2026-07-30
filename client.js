import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    user?.role === "donor" ? "/donor" : user?.role === "receiver" ? "/receiver" : user?.role === "admin" ? "/admin" : "/";

  return (
    <header className="sticky top-0 z-30 border-b border-mint bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-canopy">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canopy text-paper">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 12a6 6 0 0112 0" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          </span>
          FeedX
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-canopy-700 md:flex">
          <Link to="/browse" className="hover:text-canopy">Browse food</Link>
          <Link to="/#how-it-works" className="hover:text-canopy">How it works</Link>
          <Link to="/#impact" className="hover:text-canopy">Impact</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashboardPath} className="hidden text-sm font-semibold text-canopy sm:block">
                {user.name?.split(" ")[0]}'s dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-secondary !px-4 !py-2 text-sm"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-canopy hover:underline">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
