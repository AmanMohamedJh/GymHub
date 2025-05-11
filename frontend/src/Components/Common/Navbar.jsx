import { Link, useLocation, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { FaTools, FaAd } from "react-icons/fa";
import { Fragment } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../Common/Navbar.css";
import "../Common/NavbarDropdown.css"; // custom dropdown style

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gyms", href: "/client-browse-gym" },
  { name: "Trainers", href: "/client-browse-trainers" },
  { name: "Contact Us", href: "/contact" },
  { name: "About Us", href: "/about" },
];

const getNavigation = (user) => {
  if (!user) return navigation;
  if (user.role === "admin") return [];

  const items = [...navigation];
  if (user.role === "client") {
    // Insert Progress link before Contact Us
    items.splice(3, 0, { name: "Progress", href: "/client-progress-tracking" });
  }
  return items;
};

const getDashboardRoute = (role) => {
  switch (role) {
    case "gym_owner":
      return "/owner-dashboard";
    case "trainer":
      return "/trainer-dashboard";
    case "client":
      return "/client-dashboard";
    default:
      return "/";
  }
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <Disclosure as="nav" className="navbar">
      {({ open }) => (
        <>
          <div className="navbar-container">
            <div className="navbar-content">
              <div className="navbar-brand">
                <Link to="/" className="brand-name">
                  Gym<span>Hub</span>
                </Link>
              </div>

              <div className="navbar-links">
                {[
                  ...getNavigation(user).map((item) => {
                    if (item.name === "Trainers") {
                      return (
                        <div
                          key="Trainers"
                          className="nav-link dropdown"
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <span
                            className={`nav-link ${
                              location.pathname === "/client-browse-trainer"
                                ? "active"
                                : ""
                            }`}
                            tabIndex={0}
                            style={{ cursor: "pointer", userSelect: "none" }}
                            onClick={(e) => {
                              e.preventDefault();
                              const menu = e.currentTarget.nextSibling;
                              if (menu)
                                menu.style.display =
                                  menu.style.display === "block"
                                    ? "none"
                                    : "block";
                              const closeDropdown = (evt) => {
                                if (
                                  menu &&
                                  !menu.contains(evt.target) &&
                                  evt.target !== e.currentTarget
                                ) {
                                  menu.style.display = "none";
                                  document.removeEventListener(
                                    "mousedown",
                                    closeDropdown
                                  );
                                }
                              };
                              document.addEventListener(
                                "mousedown",
                                closeDropdown
                              );
                            }}
                          >
                            Trainers
                          </span>
                          <div
                            className="dropdown-menu-custom"
                            style={{
                              display: "none",
                              position: "absolute",
                              top: "calc(100% + 4px)",
                              left: 0,
                              zIndex: 1000,
                            }}
                          >
                            <div
                              className="dropdown-item"
                              onClick={() => {
                                window.location.href = "/client-browse-trainer";
                              }}
                            >
                              All Trainers
                            </div>
                            <div
                              className="dropdown-item"
                              onClick={() => {
                                navigate("/trainer-tips");
                              }}
                            >
                              Workout Tips
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`nav-link ${
                          location.pathname === item.href ? "active" : ""
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  }),
                ]}
              </div>

              <div className="navbar-auth">
                {user ? (
                  <Menu as="div" className="user-menu">
                    <Menu.Button className="user-menu-button">
                      <span className="user-name">{user.name}</span>
                      <UserCircleIcon
                        className="profile-icon"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="user-dropdown">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={getDashboardRoute(user.role)}
                              className={`dropdown-item ${
                                active ? "active" : ""
                              }`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        {/* Show MySubscription for gym owners, clients and trainers */}
                        {(user.role === "gym_owner" ||
                          user.role === "client" ||
                          user.role === "trainer") && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/my-subscription"
                                className={`dropdown-item ${
                                  active ? "active" : ""
                                }`}
                              >
                                My Subscription
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        {/* Equipment Management for gym owners */}
                        {user.role === "gym_owner" && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/equipment-management"
                                className={`dropdown-item ${
                                  active ? "active" : ""
                                }`}
                              >
                                <FaTools className="menu-icon" />
                                Equipment Management
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        {user.role === "gym_owner" && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/ad-manager"
                                className={`dropdown-item ${
                                  active ? "active" : ""
                                }`}
                              >
                                <FaAd className="menu-icon" />
                                Ad Manager
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/user-profile"
                              className={`dropdown-item ${
                                active ? "active" : ""
                              }`}
                            >
                              Profile Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`dropdown-item ${
                                active ? "active" : ""
                              }`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Register
                    </Link>
                  </>
                )}
              </div>

              <div className="mobile-menu-button-container">
                <Disclosure.Button className="mobile-menu-button">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="mobile-menu">
            {getNavigation(user).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-nav-link ${
                  location.pathname === item.href ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={getDashboardRoute(user.role)}
                  className="mobile-nav-link"
                >
                  Dashboard
                </Link>
                {(user.role === "gym_owner" ||
                  user.role === "client" ||
                  user.role === "trainer") && (
                  <Link to="/my-subscription" className="mobile-nav-link">
                    My Subscription
                  </Link>
                )}
                {user.role === "gym_owner" && (
                  <Link to="/equipment-management" className="mobile-nav-link">
                    <FaTools className="menu-icon" />
                    Equipment Management
                  </Link>
                )}
                {user.role === "gym_owner" && (
                  <Link to="/ad-manager" className="mobile-nav-link">
                    <FaAd className="menu-icon" />
                    Ad Manager
                  </Link>
                )}
                <Link to="/user-profile" className="mobile-nav-link">
                  Profile Settings
                </Link>
                <button onClick={handleLogout} className="mobile-nav-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
