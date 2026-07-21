// components/ProjectShowcase.jsx
"use client";
// components/ProjectShowcase.jsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Redantio",
    description: "Designed a Startup in 6 Hours",
    image: "/redantio.webp",
    category: "Brand Design",
    text: "Case Study",
    link: "https://hippogriff.medium.com/redantio-designing-a-startup-in-6-hours-4e24a593950f",
  },
  {
    id: 2,
    title: "Chaya UI",
    description: "Open-source design system and React library.",
    image: "/chaya.avif",
    category: "Design System",
    link: "https://chaya.traboda.com",
    text: "Visit Site",
  },
  {
    id: 3,
    title: "KLU PAS",
    description: "Public Address System for K. L. University",
    image: "/customamplifierbox.webp",
    category: "Product Design",
    link: "https://hippogriff.medium.com/ux-case-study-of-public-adressing-system-for-hoste-a84ce1583288",
    text: "Case Study",
  },
  {
    id: 4,
    title: "Own Your Bill",
    description: "New Age Customizable Billing System",
    image: "/videos/8.gif",
    category: "Product Design",
    link: "https://www.figma.com/board/iZoO9T4W3C4RwIUWZRbZsV/Case-Study?node-id=0-1&t=OAdZQYVAwiFOnSA7-1",
    text: "Case Study",
  },
  {
    id: 5,
    title: "Tailus",
    description: "Tailwind CSS UI Kit",
    image: "/tailus.png",
    category: "Design System",
    link: "https://www.behance.net/gallery/210333091/Tailus-Ui-Case-Study",
    text: "Case Study",
  },
  {
    id: 6,
    title: "APSPCl",
    description: "Website for APSPCL (Andhra Pradesh Solar Power Corporation Private Limited)",
    image: "/videos/2.gif",
    category: "Website",
    link: "https://apspcl.ap.gov.in",
    text: "Visit Site",
    
  },
  {
    id: 7,
    title: "RWDY Store Revamp",
    description: "Revamping the RWDY Store (E commerce Fashion Store)",
    image: "/videos/1.gif",
    category: "Website",
    link: "https://www.behance.net/gallery/195847337/RWDY-Store-Revamping",
    text: "Visit Site",
    
  },
  {
    id: 8,
    title: "B Sides Kochi",
    description: "Website for B Sides Kochi A Cyber Security Conference",
    image: "/videos/9.gif",
    category: "Website",
    link: "https://bsideskochi.in/",
    text: "Visit Site",
    
  },
  {
    id: 9,
    title: "Bi0s Hardware",
    description: "Website for bi0s hardware (A Cyber Security Organization)",
    image: "/bi0shardware.png",
    category: "Website",
    link: "https://bi0shardware.com/",
    text: "Visit Site",
    
  },
  {
    id: 10,
    title: "Graphic Design",
    description: "Graphics Designs for various events and organizations",
    image: "/wiredctf.png",
    category: "Graphic Design",
    link: "https://bi0shardware.com/",
    text: "Visit Site",
    
  },
  
  
];

const ProjectCard = ({ project }) => {
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
  
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      // Calculate position as percentage of card dimensions (between -0.5 and 0.5)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate movement range (between -1 and 1)
      const moveX = ((x - centerX) / centerX) * 5; // 15px max movement
      const moveY = ((y - centerY) / centerY) * 5; // 15px max movement
      
      setMousePosition({ x: moveX, y: moveY });
    };
  
    return (
        <div>
      <motion.div
        ref={cardRef}
        layoutId={`project-card-${project.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-lg cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
      >
        <Link href={project.link} passHref>
          <motion.div
            className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden"
            animate={{
              x: hovered ? mousePosition.x : 0,
              y: hovered ? mousePosition.y : 0,
              scale: hovered ? 1.05 : 1,
              boxShadow: hovered 
                ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                : "0 0 0 0 rgba(0, 0, 0, 0)"
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 1
            }}
          >
            <div className="absolute right-4 top-4 bg-black bg-opacity-80 text-white text-xs px-3 py-1 rounded-full z-10">
              {project.category}
            </div>
            
            {/* Project image */}
            <div className="w-full h-full bg-gray-200 relative">
              <Image 
                src={project.image} 
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500"
              />
            </div>
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent"
              animate={{
                opacity: hovered ? 1 : 0,
                y: hovered ? 0 : 10
              }}
              transition={{
                duration: 0.3
              }}
            >
              <h3 className="text-white text-xl  mb-2">{project.title}</h3>
              <p className="text-gray-200 text-sm">{project.description}</p>
              <div className="mt-4">
                <span className="inline-block bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full">
                  {project.text}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
      </div>
    );
  };
  
  const ProjectShowcase = () => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Product Design' , 'Design System','Brand Design', 'Website', 'Graphic Design', ];
    
    const filteredProjects = filter === 'All' 
      ? projects 
      : projects.filter(project => project.category === filter);
    
    return (
      <div className="w-[90%] mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar - sticky */}
          <div className="lg:w-1/5 lg:sticky lg:top-16 lg:self-start">
            <div className="mb-16">
              <h1 className="text-4xl  mb-8">I did</h1>
              <div className="flex flex-col gap-3 mb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-5 py-2 inline-flex w-64 rounded-full border ${
                      filter === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black transition-colors'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <h1 className="text-4xl ">
                and<br />everything<br />in between in my past.
              </h1>
            </div>
          </div>
          
          {/* Projects grid - main content */}
          <div className="lg:w-4/5">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              layout
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </motion.div>
            
            {/* <div className="mt-12 text-center">
              <Link href="/all-projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  View All Projects
                </motion.button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProjectShowcase;