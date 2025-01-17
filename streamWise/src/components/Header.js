import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utilis/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser, removeUser } from "../utilis/UserSlice";
import { SUPPORTED_LANGUAGES } from "../utilis/constants";
import { toggleGptSearchView } from "../utilis/gptSlice";
import lang from "../utilis/languageConstants";
import { changeLanguage } from "../utilis/configSlice";
import logo from "../assets/logoo.png"

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);
    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigate("/");
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
                navigate("/error");
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const { uid, email, displayName, photoURL } = user;
                dispatch(
                    addUser({
                        uid: uid,
                        email: email,
                        displayName: displayName,
                        photoURL,
                    })
                );
                navigate("/browse");
            } else {
                dispatch(removeUser());
                navigate("/");
            }
        });
        // Insubscribe when component unmounts
        return () => unsubscribe();
    }, []);
    const handleGptSearchClick = () => {
        //toggle GPT search
        dispatch(toggleGptSearchView());
    };

    const handleLanguageChange = (e) => {
        dispatch(changeLanguage(e.target.value));
    };

    const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

    return (
        <div className="fixed  w-screen px-[20%] md:px-8  bg-gradient-to-bl from-black sm:bg-blue-900 md:bg-green-900 z-30 flex flex-col md:flex-row justify-between">
            <img className="w-44 mx-auto md:mx-0" src={logo} alt="logo" />
            {user && (
                <div className="  flex p-2 justify-between ">
                    {showGptSearch && (
                        <select
                            className="p-2 m-2 bg-gray-900 text-white"
                            onClick={handleLanguageChange}
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <option key={lang.identifier} value={lang.identifier}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        className="py-2 px-4 my-2 mx-4 bg-green-700 text-white rounded-sm"
                        onClick={handleGptSearchClick}
                    >
                        {showGptSearch ? "Homepage" : "GPT Search"}
                    </button>
                    <img
                        className="hidden md:block w-9 h-9 mt-3 rounded-full"
                        alt="usericon"
                        src={user.photoURL}
                    />
                    <button className="font-bold text-white p-2" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Header;
