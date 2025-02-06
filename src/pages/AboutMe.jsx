/** File name: AboutMe.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React from 'react';
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import { FaLinkedinIn } from 'react-icons/fa';
import { AiOutlineFilePdf } from "react-icons/ai";

import  BackgroundVideo from "../components/BackgroundVideo";

const AboutMe = () => {
  return (
    <div id="aboutme" className="relative flex flex-col justify-center items-center h-screen h-full">
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
                        src="../src/assets/profile2.svg"
                        className="w-[200px] h-[200px]"
                    />          
                    <h1 className="text-4xl font-bold pt-3">Apple Jan Tacardon</h1>
                    <h2 className="pt-3">I'm a
                        <TypeAnimation
                            sequence={[
                                // Same substring at the start will only be typed out once, initially
                                'Capricorn ♑️',
                                1000, // wait 1s before replacing "Software Engineer
                                'Monkey 🐒',
                                1000,
                                'Chief Tidiness Officer (CTO)',
                                1000                                
                            ]}
                            wrapper="span"
                            speed={50}
                            style={{ fontSize: '1em', display: 'inline-block', paddingLeft: '5px' }}
                            repeat={Infinity}
                        />
                    </h2>
                    <div className="flex justify-center pt-3 max-w-[200px] w-full items-center">
                        <FaLinkedinIn className="cursor-pointer hover:scale-110 transition" size={20} title="LinkedIn"/>
                        <a 
                          href="../src/assets/applejantacardon-resume2025.pdf" 
                          title="Download Resume"
                          download>
                          <AiOutlineFilePdf size={20} color="black" className="cursor-pointer hover:scale-110 transition" />
                        </a>
                    </div>
                    <br/>
                    <h2 className="text-sm text-center max-w-[800px] mx-auto ">With 7+ years of experience in full-stack development and software engineering, working for companies like Accenture and Centennial College, I have built technology solutions that make a real impact. From crafting webpages to implementing complex ETL scripts, I have developed user-friendly and robust applications across corporate environments and freelance projects. My expertise aligns with your requirements, particularly in database management, testing & quality assurance, and Java programming. At Accenture, I specialized in data mapping, stored procedures, and integrations using Snowflake, Java, Spring, NodeJS, Angular, and OracleSQL, while my earlier roles involved developing healthcare, POS, and inventory systems with PHP, JavaScript, and MySQL. Additionally, my WordPress development experience includes customizing site architecture, optimizing performance, and delivering responsive designs for small businesses and nonprofits, ensuring user experience, security, and scalability. A significant aspect of my work involves bridging the gap between design and development, where I have translated Figma wireframes into functional code, tested for browser compatibility, and collaborated with designers to bring visions to life. Clear communication and strong project management skills define my approach, ensuring seamless collaboration across teams. Holding a Bachelor of Science in Information Technology, I am currently advancing my expertise in software engineering with a specialization in Health Informatics Technology, further strengthening my ability to develop innovative and efficient solutions in the healthcare technology space.</h2>
                </div>
                
            </div>
    </div>
  );
};

export default AboutMe;
