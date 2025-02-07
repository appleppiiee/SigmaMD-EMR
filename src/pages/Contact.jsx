/** File name: Contact.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React from 'react';
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import  BackgroundVideo from "../components/BackgroundVideo";
import LogoImg from "/logo.svg";

const Contact = () => {
  return (
    <div id="contact" className="relative flex flex-col justify-center items-center h-screen">
            <BackgroundVideo /> {/* Video Component */}         
            <div className="w-full h-screen absolute top-0 left-0 bg-white/50">            
                <div className="flex flex-col justify-center items-center h-full">
                    <motion.img
                        initial={{ scale: 1 }}
                        whileHover={{
                        scale: [1, 1.1, 1], // Pulsating effect
                        transition: {
                            duration: 0.6,
                            repeat: Infinity, // Infinite looping
                            repeatType: "reverse", // Reverse effect for smooth scaling
                            ease: "easeInOut",
                        },
                        }}
                        src="{LogoImg}"
                        className="w-[100px] h-[100px]"
                    />          
                    <h1 className="text-4xl font-bold">Contact Me</h1>
                    <br/>                  
                    
                    <p className="text-center max-w-[800px] mb-4">
                        Have a question or want to work together? Feel free to reach out!
                    </p>
                    <form className="w-[80%] max-w-[500px]">
                        <div className="mb-4">
                        <label htmlFor="name" className="block text-left font-bold mb-2">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="email" className="block text-left font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Your Email"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        </div>
                        <div className="mb-4">
                        <label htmlFor="message" className="block text-left font-bold mb-2">
                            Message:
                        </label>
                        <textarea
                            id="message"
                            placeholder="Your Message"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            rows="4"
                        ></textarea>
                        </div>
                        <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                        Send
                        </button>
                    </form>
                    
                </div>
                
            </div>
    </div>
  );
};

export default Contact;
