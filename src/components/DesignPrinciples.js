// components/DesignPrinciples.jsx
"use client";
import { useState } from "react";
import { Search, Sparkles, Users, Type, Target, Clock } from "lucide-react";

export default function DesignPrinciples() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const principles = [
    {
      title: "Design should be at the strategy table",
      icon: <Target className="w-6 h-6" />,
      description:
        "Design influences business decisions and should be part of strategic planning from the beginning.",
    },
    {
      title: "First impressions matters",
      icon: <Clock className="w-6 h-6" />,
      description:
        "Users form opinions about your product within seconds of interaction.",
    },
    {
      title: "I get things done, the right way",
      icon: <Sparkles className="w-6 h-6" />,
      description:
        "Efficient execution without compromising on quality or principles.",
    },
    {
      title: "I like to keep things easy for everyone",
      icon: <Users className="w-6 h-6" />,
      description:
        "Accessibility and simplicity are core tenets of good design.",
    },
    {
      title: "I'm all about typography",
      icon: <Type className="w-6 h-6" />,
      description:
        "Typography is fundamental to communication, readability, and brand identity.",
    },
    {
      title: "I'm curious and love learning",
      icon: <Search className="w-6 h-6" />,
      description:
        "Continuous growth and adaptation through research and exploration.",
    },
  ];

  return (
    <div className="w-[90%] mx-auto p-8">
      <div className="mb-12 border-b border-gray-200 ">
        <h1 className="text-3xl font-semibold mb-8">
          Here are 6 philosophies you can always expect from me
        </h1>

        {/* Hover instruction with arrow */}
        <div className="absolute -left-16 top-4">
          <div className="relative">
            <div className="absolute -top-2 -right-24"></div>
          </div>
        </div>
      </div>

      <div className="flex  w-[90%] mx-auto items-left justify-end ">
        <div className="w-full md:w-4/5 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md relative h-48"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h2 className="text-xl font-medium mb-4">{principle.title}</h2>
                <div className="absolute bottom-6 left-6">{principle.icon}</div>

                {/* Description that appears on hover */}
                <div
                  className={`absolute inset-0 bg-white bg-opacity-95 rounded-lg p-6 transition-opacity duration-300 flex items-center ${
                    hoveredCard === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <p>{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
