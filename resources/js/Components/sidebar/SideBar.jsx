import { Link, usePage, router } from "@inertiajs/react";
import { useState, useContext } from "react";
import Navigation from "@/Components/sidebar/Navigation";
import ThemeToggler from "@/Components/sidebar/ThemeToggler";
import { ThemeContext } from "../ThemeContext";
// import NotificationBell from "@/Components/NotificationBell";
import {
    Menu,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    User,
    ToolCase,
} from "lucide-react";

export default function Sidebar() {
    const { display_name, emp_data } = usePage().props;
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // desktop toggle
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // mobile toggle

    // Logout function
    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();

        window.location.href = route("logout"); // Laravel handles SSO redirect
    };

    const formattedAppName = display_name
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <div className="flex">
            {/* Mobile Hamburger */}
            <button
                className="absolute z-[60] p-2 rounded top-4 left-4 md:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay (mobile only) */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed md:relative top-0 left-0 z-50 transition-all duration-300
        ${
            isMobileSidebarOpen
                ? "translate-x-0"
                : "md:translate-x-0 -translate-x-full md:!translate-x-0"
        }
        flex flex-col min-h-screen
        ${isSidebarOpen ? "w-[240px]" : "w-[80px]"}
        px-4 pb-6 pt-4
        bg-orange-900 text-white
    `}
            >
                {/* Desktop Collapse Button */}
                <button
                    className="hidden md:flex items-center justify-center absolute top-4 right-[-18px] 
                       btn btn-sm btn-circle shadow-md 
                       bg-base-200 hover:bg-base-300 
                       transition"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? (
                        <PanelLeftClose className="w-4 h-4" />
                    ) : (
                        <PanelLeftOpen className="w-4 h-4" />
                    )}
                </button>

                {/* Close button on mobile */}
                <button
                    className="absolute top-4 right-4 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>

     {/* LOGO */}
                <div className="flex justify-center">
                    <Link
                        href={route("dashboard")}
                        className={`flex items-center ${
                            isSidebarOpen ? "px-4" : "justify-center"
                        }`}
                    >
                        <img
                            src="/images/Telford_logo.jpg"
                            alt="Logo"
                            className={`${
                                isSidebarOpen
                                    ? "w-full max-w-[160px] h-10"
                                    : "w-10 h-10"
                            } object-contain`}
                        />
                    </Link>
                </div>

                <br />

                {/* Navigation */}
                <Navigation isSidebarOpen={isSidebarOpen} />

                {/* Mobile-only (Notification + Profile + Logout) */}
                {isMobileSidebarOpen && (
                    <div className="mt-6 border-t border-base-300 pt-4 md:hidden">
                        <div className="flex items-center mb-3 space-x-2">
                            {/* <NotificationBell /> */}
                            <span className="font-medium">
                                Hello, {emp_data?.emp_firstname}
                            </span>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Link
                                href={route("profile.index")}
                                className="flex items-center space-x-2 hover:bg-base-200 p-2 rounded-lg transition"
                            >
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 hover:bg-base-200 p-2 rounded-lg transition"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Theme toggler */}
                <div
                    className={`${
                        isSidebarOpen ? "block" : "hidden"
                    } md:block mt-auto`}
                >
                    <ThemeToggler toggleTheme={toggleTheme} theme={theme} />
                </div>
            </div>
        </div>
    );
}
