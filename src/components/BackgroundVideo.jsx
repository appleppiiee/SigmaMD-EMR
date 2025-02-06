/** File name: BackgroundVideo.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/

import React,{useState} from "react";

const BackgroundVideo = () => {
  return (
    <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full h-screen object-cover object-left scale-x-[-1]"
    >
      <source src="../src/assets/banner.mp4" type="video/mp4" />      
      Your browser does not support the video tag.
    </video>
  );
}

export default BackgroundVideo;
