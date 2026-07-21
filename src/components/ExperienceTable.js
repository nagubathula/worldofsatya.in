import React from 'react'

// components/ExperienceTable.js

export default function ExperienceTable() {
    const experiences = [
      {
        period: "2010 - 2014",
        company: "AiO Studio",
        roles: ["Graphic Designer"],
      },
      {
        period: "2014 - 2016",
        company: "MOV Communication",
        roles: ["Graphic Designer"],
      },
      {
        period: "2016 - 2017",
        company: "Lune Production",
        roles: ["Brand Designer"],
      },
      {
        period: "2017 - 2018",
        company: "Buzz Communication",
        roles: ["Experiential Designer"],
      },
      {
        period: "2020 - Present",
        company: "TangoSquared",
        roles: ["Senior Designer", "Design Director"],
      },
    ];
  
    return (
      <div className="overflow-x-auto">
        <table className="container mx-auto text-4xl table-auto bg-white">
          <tbody>
            {experiences.map((exp, idx) => (
              <tr key={idx} className="border-b last:border-b-0 p-4">
                {/* Period */}
                <td className="py-4 px-6 align-top w-1/4 text-gray-800 font-medium">
                  {exp.period}
                </td>
                {/* Company */}
                <td className="py-4 px-6 align-top w-1/3 text-gray-800">
                  {exp.company}
                </td>
                {/* Roles */}
                <td className="py-4 px-6 align-top w-1/3 text-gray-800">
                  {exp.roles.map((role, i) => (
                    <div key={i}>{role}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  