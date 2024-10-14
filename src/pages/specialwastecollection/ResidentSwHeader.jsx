import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

function ResidentSwHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActiveRoute = (path) => {
        return location.pathname.includes(path);
    };

    const NavButton = ({ path, icon, text }) => (
        <button 
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors duration-200 ${
                isActiveRoute(path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => navigate(path)}
        >
            {icon}
            <span>{text}</span>
        </button>
    );

    const HomeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
    );

    const PlusIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
    );

    const ShoppingBagIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div>
            header 2
        </div>
        // <div className="flex h-screen bg-gray-100">
        //     {/* Sidebar navigation */}
        //     <nav className="bg-gray-800 w-64 p-6 space-y-6">
        //         <div className="flex items-center space-x-2 text-white">
        //             <ShoppingBagIcon />
        //             <span className="text-2xl font-bold">Sales Admin</span>
        //         </div>
        //         <div className="space-y-2">
        //             <NavButton 
        //                 path="/admin/salescampaigns/allcampaigns"
        //                 icon={<HomeIcon />}
        //                 text="Campaigns"
        //             />
        //             <NavButton 
        //                 path="/admin/salescampaigns/addcampaign"
        //                 icon={<PlusIcon />}
        //                 text="Add Campaign"
        //             />
        //             <NavButton 
        //                 path="/admin/salescampaigns/saleitems"
        //                 icon={<ShoppingBagIcon />}
        //                 text="Sale Items"
        //             />
        //         </div>
        //     </nav>

        //     {/* Main content */}
        //     <div className="flex-1 p-10 overflow-y-auto">
        //         <Routes>
        //             <Route path="/requestswcollection/*" element={<ResidentSwRequest />} />
        //         </Routes>
        //     </div>
        // </div>
    );
}

export default ResidentSwHeader;