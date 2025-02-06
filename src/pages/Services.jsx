/** File name: Services.jsx
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

const Services = () => {
  return (
    <div id="aboutme" className="relative flex flex-col justify-center items-center h-screen h-full">
    <BackgroundVideo /> {/* Video Component */}         
    <div className="w-full h-screen absolute top-0 left-0 bg-white/50">  
        <div className="max-w-[1040px] m-auto md:pl-20 p-4 py-16">
            <h1 className="text-4xl font-bold text-center">Services</h1>
            <br/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example Service Card */}
              <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Web Development</h2>
                <p className="text-sm">
                  Custom web development services to help you build dynamic and responsive websites.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Health Informatics Solutions</h2>
                <p className="text-sm">
                  Leveraging technology to improve healthcare processes and patient outcomes.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-2">Full Stack Development</h2>
                <p className="text-sm">
                  Expertise in both front-end and back-end development to create end-to-end solutions.
                </p>
              </div>
            </div>
          
        </div>        
    </div>
</div>
  );
};

export default Services;
