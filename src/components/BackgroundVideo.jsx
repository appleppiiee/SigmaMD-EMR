/** File name: BackgroundVideo.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/

import React,{useState} from "react";
import banner from "/banner.mp4";

const BackgroundVideo = () => {
  return (
    <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full h-screen object-cover object-left scale-x-[-1]"
    >
      <source src="{banner}" type="video/mp4" />      
      Your browser does not support the video tag.
    </video>
  );
}

export default BackgroundVideo;
