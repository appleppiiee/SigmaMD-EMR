/** File name: Projects.jsx
** Name: Apple Jan Tacardon
** ID: 301426032
** Date: February 5, 2025
**/
import React from 'react';
import  ProjectItem from "../components/ProjectItem";
import easyjobImg from "../assets/easyjob.svg";
import wimtachImg from "../assets/wimtach.svg";
import hgnImg from "../assets/humangrowthnetwork.svg"; 
import cloudmdImg from "../assets/cloudmd.svg";
import cloudpxImg from "../assets/cloudpx.svg";
import propetiesImg from "../assets/epropertiescentral.svg";


import  BackgroundVideo from "../components/BackgroundVideo";

const PdfIcon = () => {
  return <BsFileEarmarkPdfFill size={30} color="red" />;
};

const Projects = () => {
  return (
    <div id="projects" className="relative flex flex-col justify-center items-center h-screen">
      <BackgroundVideo /> {/* Video Component */}         
      <div className="w-full h-screen absolute top-0 left-0 bg-white/50">  
        <div className="max-w-[1040px] m-auto md:pl-20 p-4 py-16">
            <h1 className="text-4xl font-bold text-center">Projects</h1>
            <br/>
            <p className="text-center py-8">I turn complex challenges into smart solutions. Whether it's designing  systems, fixing glitches, or making data more meaningful, <br/>
              I focus on efficiency and innovation. Every project is a little magic in motion.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ProjectItem img={easyjobImg} title="Easy Job" description="WordPress Developer" sub="Custom WordPress" shorts="A responsive WordPress website built for a Recruitment solutions companies to employers services and attract talents." />
              <ProjectItem img={wimtachImg} title="WIMTACH" description="WordPress Developer" sub="Custom WordPress, Otter Blocks" shorts="A responsive WordPress website built for an Talent solutions company to showcase services and attract clients." />
              <ProjectItem img={hgnImg} title="The Human Growth Network" description="WordPress Developer" sub="WordPress, Divi" shorts="A responsive WordPress website built for an IT solutions company to showcase services and attract clients."/>
              <ProjectItem img={cloudmdImg} title="CloudMD" description="Full Stack Developer" sub="Codeigniter, AngularJS" shorts="A data visualization dashboard for healthcare providers to analyze patient records and system performance efficiently." />
              <ProjectItem img={cloudpxImg} title="CloudPX" description="Full Stack Developer" sub="Codeigniter, AngularJS" shorts="A data visualization dashboard for patients to analyze patient records and system performance efficiently." />
              <ProjectItem img={propetiesImg} title="E-Properties Central" description="Full Stack Developer" sub="Custom WordPress, Advanced Custom Fields" shorts="A real estate platform for listing, searching, and managing properties, with an admin dashboard for data management." />
            </div>
        </div>               
      </div>
    </div>
  );
};

export default Projects;
