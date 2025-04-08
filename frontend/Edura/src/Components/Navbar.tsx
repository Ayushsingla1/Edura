import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import { ConnectKitButton } from "connectkit";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {

    const [signInModal, setSignInModal] = useState(false);
    const navigate = useNavigate();

    return <div className="relative w-screen flex px-10 py-4 items-center text-white bg-gradient-to-r from-purple-900/20 to-blue-900/20 transition-all justify-around mt-0">
        <div><span className="text-3xl font-semibold text-transparent bg-clip-text  bg-gradient-to-r from-purple-600 to-blue-600 hover:cursor-pointer self-start
        " onClick={() => navigate('/')}>Edura</span></div>
        <div className="self-center">
            <ul className="flex gap-x-10 font-medium justify-center">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/courses">Courses</NavLink></li>
                <li><NavLink to="/userCourses">Your Courses</NavLink></li>
                <li><NavLink to="/meet">AI Meet</NavLink></li>
            </ul>
        </div>
        <div className="flex gap-x-6 items-center self-end">
            <ConnectKitButton />
            <div className="flex items-center justify-center">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
    {signInModal ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="relative bg-transparent p-6 rounded-lg shadow-lg w-full max-w-md">
                <SignIn />
                <button
                    className="absolute top-2 right-2 text-black bg-gray-200 w-8 h-8 hover:bg-gray-300 rounded-full"
                    onClick={() => setSignInModal(false)}
                >
                    ✕
                </button>
            </div>
        </div>
    ) : (
        <div
            className="bg-zinc-700/90 rounded-2xl px-4 py-2 hover:cursor-pointer font-light text-base"
            onClick={() => setSignInModal(!signInModal)}
        >
            Sign In
        </div>
    )}
</SignedOut>


            </div>
        </div>
    </div>
}

export default Navbar;