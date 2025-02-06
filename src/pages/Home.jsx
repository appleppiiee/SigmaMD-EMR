/** File name: Home.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React from 'react';
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import { FaLinkedinIn } from 'react-icons/fa';
import  BackgroundVideo from "../components/BackgroundVideo";

const Home = () => {
    return (
        <div id="home" className="relative flex flex-col justify-center items-center h-screen">
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
                        src="../src/assets/logo.svg"
                        className="w-[250px] h-[250px]"
                    />          
                    <h1 className="text-4xl font-bold">Hi! I'm Apple! </h1>
                    <h2 className="flex sm:text-3xl text-2xl pt-4">
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Software Engineer',
                                1000, // wait 1s before replacing "Software Engineer
                                'Full Stack Developer',
                                1000,
                                'Freelancer',
                                1000,
                                'Health Informatics Technology',
                                1000
                            ]}
                            wrapper="span"
                            speed={50}
                            style={{ fontSize: '1em', display: 'inline-block', paddingLeft: '5px' }}
                            repeat={Infinity}
                        />
                    </h2>
                    <div className="flex justify-center pt-6 max-w-[200px] w-full items-center">
                        <FaLinkedinIn className="cursor-pointer hover:scale-110 transition" size={20} />
                    </div>
                    <br/>
                    <h2 className="text-center max-w-[800px] mx-auto ">I design systems, troubleshoot errors, and somehow still manage to stay on top of my to-do list. Health informatics is where technology meets patient care, and I thrive at that intersection—bringing problem-solving skills from my software engineering background into a field that desperately needs smart, data-driven solutions. But life isn’t just about coding and analytics; sometimes it’s about figuring out why the washing machine stopped mid-cycle or why my alarm clock and I have a complicated relationship. Whether it’s streamlining workflows or organizing daily life, I believe in making things run smoother—because chaos is only fun in theory.</h2>
                </div>
                
            </div>
        </div>
    )
}

export default Home