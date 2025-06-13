import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-indigo-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-indigo-300">
          InfraScan
        </Link>
        <div className="space-x-6 text-lg font-semibold">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-300"
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-300"
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-indigo-300 underline" : "hover:text-indigo-300"
            }
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
