import Image from "next/image";

export default function Features() {
  return (
    <div className="min-h-screen p-8 text-white">
    <div className="container  mx-auto relative rounded-xl bg-[url(/images/tortoise-shell.svg)] bg-cover ">
    

      <div className="h-auto overflow-hidden px-10 md:rounded-[24px] bg-gradient-to-b from-[#004080] to-[#001F3F]">
        <div className="mx-auto flex w-[90%] max-w-[1000px] flex-col items-center rounded-[16px] rounded-t-none  pt-10 pb-[48px] ">
          <div className="px-2 py-2 bg-contain bg-no-repeat" >
            <div className="p-4 pt-[10px] text-center text-[14px] font-semibold tracking-[2.94px] uppercase text-[#E0F7FF]">
              Why we are different ?
            </div>
          </div>

          <div className="text-center mt-[36px] text-[24px] md:text-[48px] font-semibold text-[#E0F7FF]">
            Fast, flexible, efficient
          </div>

          <div className="mt-[24px] mb-[48px] w-full text-center text-[12px] md:w-[90%] md:text-[22px] font-medium text-[#A1C4E0]">
            <p className="text-blue-200 mb-4">
              A user-centered design approach helps you make better and faster decisions based on user research. It&apos;s a methodology that allows your company to go from sketching ideas to the final product with exceptional results.
            </p>
            <p className="text-blue-200 font-medium">
              It&apos;s not magic, it&apos;s purely innovative design thinking.
            </p>
          </div>

          
        </div>

        <div className="relative mt-10 flex justify-center gap-1 md:mt-[100px] lg:h-[400px]">
          <div className="flex flex-col flex-wrap justify-center gap-3 md:flex-nowrap lg:flex-row">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`bg-blue-500 flex w-auto flex-col gap-2 rounded-[12px] border border-[#66A3FF] p-6 md:gap-6 lg:h-[600px] lg:w-1/4 ${card.rotation}`}
              >
                <div className="flex flex-row items-start gap-2 md:flex-col">
                  <img alt="" src={card.icon} className="h-7 md:h-[60px]" />
                  <h4 className="text-base md:text-[28px] font-semibold text-white">{card.title}</h4>
                </div>
                <p className="text-[12px] md:text-[18px] font-medium text-[#B3D9FF]">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

const cards = [
  {
    icon: "/icons/checkout_icon.svg",
    title: "Breakthrough Design",
    description: "nFactor simplifies the way of creating stunning digital experiences with breakthrough design methodologies and user research.",
    rotation: "lg:rotate-[-2deg]",
  },
  {
    icon: "/icons/studio_icon.svg",
    title: "Design to Deployment",
    description: "We provide complete digital solutions, from design to deployment. Whether it's a small business website or an enterprise-grade platform, we handle it all.",
    rotation: "lg:rotate-[-1deg] lg:translate-y-[-50px]",
  },
  {
    icon: "/icons/orchestration_icon.svg",
    title: "Versatile",
    description: "Imagine all the digital challenges that need innovative solutions. If you can see it, we can make it happen - from e-commerce to complex web applications.",
    rotation: "lg:rotate-[1deg] lg:translate-y-[-50px]",
  },
  {
    icon: "/icons/analytics_icon.svg",
    title: "Analytics",
    description: "Unlock the true power of your payments data with actionable insights to drive smarter decisions.",
    rotation: "lg:rotate-[2deg] lg:translate-y-0",
  },
];
