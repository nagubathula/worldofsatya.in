// pages/services.js
import Link from "next/link";

const services = [
  {
    title: "Web Development",
    description:
      "We craft high-performance, scalable websites and web applications tailored to your business needs.",
    highlight: "Custom-built solutions for the modern web",
    iconColor: "text-blue-500",
    icon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" strokeWidth="2" />
        <path d="M30 40 H70 M30 50 H60 M30 60 H50" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "No Code Web Development",
    description:
      "Leverage the power of no-code platforms to build dynamic, interactive websites without writing a single line of code.",
    highlight: "Faster development, seamless execution",
    iconColor: "text-green-500",
    icon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
        <path d="M40 50 H60" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "UI/UX Design",
    description:
      "We create stunning and intuitive user interfaces that deliver exceptional user experiences.",
    highlight: "Designs that captivate and engage",
    iconColor: "text-purple-500",
    icon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M30 70 C30 50, 70 50, 70 70" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Branding",
    description:
      "From logos to complete brand strategies, we build strong, memorable identities that resonate with your audience.",
    highlight: "Define your brand, make an impact",
    iconColor: "text-red-500",
    icon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 50 L80 50 M50 20 L80 50 L50 80" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "SEO & Digital Marketing",
    description:
      "We optimize your online presence with advanced SEO strategies and data-driven digital marketing campaigns.",
    highlight: "Be seen, be heard, grow online",
    iconColor: "text-yellow-500",
    icon: (
      <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="2" />
        <path d="M30 40 H70 M30 60 H60" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16">
          <div className="flex mb-6">
            <span className="text-blue-500 font-medium text-sm uppercase tracking-wider">
              SERVICES
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-gray-800 max-w-2xl">
            Elevate your brand with creativity and technology
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className={`mb-6 ${feature.iconColor}`}>{feature.icon}</div>
                <h2 className="text-2xl font-medium text-gray-800 mb-6">{feature.title}</h2>
              </div>
              <div>
                <p className="text-blue-500 text-sm font-medium mb-4">{feature.highlight}</p>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
