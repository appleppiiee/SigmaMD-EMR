/** File name: ProjectItem.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React from 'react';

const ProjectItem = ({ img, title, shorts, description, sub }) => {
  return (
    <div className="relative flex items-center justify-center h-auto w-full shadow-xl shadow-gray-400 rounded-xl group hover:bg-gradient-to-r from-[#fbdae3] to-[#fce6d9]">
        <img src={img} alt={title} className="rounded-xl group-hover:opacity-10" />
        <div className="hidden group-hover:block text-center absolute pl-2 pr-2">
            <p className="text-xs font-bold text-center  text-black mb-2">{title}</p>
            <p className="text-xs  text-center  text-black mb-2">{shorts}</p>
            <p className="text-xs font-bold text-center  text-black mb-2">{description}</p>
            <p className="text-xs text-center text-black mb-2">{sub}</p>
        </div>  
      
    </div>
  );
}
export default ProjectItem;