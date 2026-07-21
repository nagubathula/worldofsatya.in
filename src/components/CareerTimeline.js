import React from "react";
import Link from "next/link";

const CareerTimeline = () => {
   

   
      const careerData= [
     
      
        {
          role: 'Product Engineer (Contract)',
          link: 'https://www.apspcl.ap.gov.in/',
          company: 'APSPCL',
          type: 'Full-time',
          period: 'Jun 2024 - Feb 2024',
          duration: '9 mos',
          location: 'Vijayawada, Andhra Pradesh, India',
          logo: '⬛',
          skills: ['User Experience Testing', 'Usability Engineering', 'Web Applications', 'UI/UX', 'Electronics']
        },
    
    
   
        {
          role: 'Product Engineer (Intern)',
          company: 'Traboda CyberLabs',
          type: 'Freelance',
          period: 'Feb 2024 - Oct 2024',
          duration: '9 mos',
          logo: '🟪',
          link: 'https://www.traboda.com/',
        },
        // {
        //   role: 'Full Stack Engineer (Intern)',
        //   company: 'Friday AI',
        //   type: 'Internship',
        //   period: 'Jul 2023 - Aug 2023',
        //   duration: '2 mos',
        //   logo: '🔵'
        // },
        // {
        //   role: 'Researcher (Student)',
        //   company: 'Team bi0s',
        //   type: 'Part-time',
        //   period: 'Feb 2022 - Mar 2024',
        //   duration: '2 yrs 2 mos',
        //   location: 'Kochi, India · Hybrid',
        //   logo: '⬜',
        //   skills: ['E-Commerce', 'UI/UX', 'User Research', 'Prototyping', 'HTML', 'JavaScript', 'User-centered Design', 'Web Development', 'Wireframing', 'Graphic Design', 'Python (Programming Language)', 'NodeJs', 'Front End Development', 'Hardware Security', 'Agile Environment']
        // },
        {
          role: 'Design And Development Engineer',
          company: 'Redantio Solutions PVT Ltd',
          type: 'Full-time',
          period: 'Feb 2023 - Aug 2023',
          duration: '7 mos',
          location: 'Kollam, Kerala, India',
          logo: '📈',
          link: 'https://www.redantio.com/',
        },
        {
          role: 'Research Intern',
          link: 'https://www.redantio.com/',
          company: 'Redantio Solutions  PVT Ltd',
          type: 'Full-time',
          period: 'Jan 2022 - Feb 2023',
          duration: '1 yr 2 mos',
          location: 'Kochi, India',
          logo: '⚪',
          skills: ['Cascading Style Sheets (CSS)', 'HTML', 'JavaScript', 'User-centered Design', 'Wireframing', 'Python (Programming Language)', 'React.js', 'Front End Development']
        },
        {
          role: 'Design Specialist',
          link: 'https://aseam.acm.org/join/',
          company: 'ACM Amritapuri Chapter',
          type: 'Freelance',
          period: 'Oct 2021 - Feb 2022',
          duration: '5 mos',
          location: 'Aluva, Kottayam (Kerala), India',
          logo: '🔴'
        }
      ];
  return (
    <div>
      <div className="w-[90%] mx-auto border-b mt-12 pb-16 border-gray-200 flex items-center ">
        <div className="bg-black text-white rounded-full px-4 py-2 text-4xl ">
          Experience
        </div>
      </div>
      <div className="flex  w-[90%] mx-auto items-left justify-end ">
        <div className="w-full md:w-4/5 ">
          {careerData.map((item, index) => (
            <div key={index} className="border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 py-6">
              <div className="md:text-2xl  md:col-span-1  mt-2 md:mt-0">
                  <div className="">{item.period}</div>
                </div>
                <div className="md:col-span-1  md:text-left mt-2 md:mt-0">
                  <Link href={item.link} className="md:text-2xl font-medium text-gray-800">
                    {item.company}
                  </Link>
                </div>
                <div className="md:col-span-1">
                  <div className="text-xl md:text-2xl font-medium text-gray-800">
                    {item.role}
                  </div>
                </div>

               

               
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerTimeline;
