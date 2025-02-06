/** File name: Sidenave.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React,{useState} from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu, AiOutlineHome,AiOutlineProject, AiOutlineMail } from "react-icons/ai";
import {BsPerson} from 'react-icons/bs';
import { GrProjects } from "react-icons/gr";

const Sidenav = () => {
    const [nav, setNav] = useState(false);
    const handleNav = () => {
        setNav(!nav);
    };
  return (
        <div>
        {/* Mobile Menu Icon */}  
        <AiOutlineMenu onClick={handleNav} className="absolute top-4 right-4 z-[99] md:hidden" />
        {/* Mobile Navigation Menu */}
        { 
            nav ? (
                    <div className="fixed w-full h-screen bg-white/90 flex flex-col justify-center items-center z-20">
                        <Link 
                            to="/"
                            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
                            onClick={handleNav}
                        >
                            <AiOutlineHome size={20} />
                            <span className="pl-4">Home</span>
                        </Link>
                        <Link 
                            to="/about" 
                            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
                            onClick={handleNav}
                        >
                            <BsPerson size={20} />
                            <span className="pl-4">AboutMe</span>
                        </Link>
                        <Link 
                            to="/projects" 
                            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
                            onClick={handleNav}
                        >
                            <GrProjects size={20} />
                            <span className="pl-4">Projects</span>
                        </Link>
                        <Link 
                            to="/services" 
                            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
                            onClick={handleNav}
                        >
                            <AiOutlineProject size={20} />
                            <span className="pl-4">Services</span>
                        </Link>
                        <Link
                            tpo="/contact" 
                            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
                            onClick={handleNav}
                        >
                            <AiOutlineMail size={20} />
                            <span className="pl-4">Contact</span>
                        </Link>
                    </div>
            ) : (
                ""
            )}
                {/* Desktop Sidebar */}
                <div className="md:block hidden fixed top-[25%] z-10">
                    <div className="flex flex-col">
                        <Link 
                            to ="/" 
                            className="rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300" title="Home">
                            <AiOutlineHome size={20}/>
                        </Link>
                        <Link 
                            to ="/about" 
                            className="rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
                            title="About Me"
                        >
                            <BsPerson size={20}/>
                        </Link>
                        <Link 
                            to ="/projects" 
                            className="rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
                            title="Projects"
                        >
                            <GrProjects size={20}/>
                        </Link>
                        <Link 
                            to ="/services" 
                            className="rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
                            title="Services"
                        >
                            <AiOutlineProject size={20}/>
                        </Link>
                        <Link 
                            to ="/contact" 
                            className="rounded-full shadow-lg bg-gray-100 shadow-gray-400 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
                            title="Contact">
                            <AiOutlineMail size={20}/>
                        </Link>
                    </div>
                </div>
        </div>
    );
}

export default Sidenav;