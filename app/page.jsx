import Image from "next/image";
import Login from "@/components/pages/Login";

export default function HomePage() {
  return (
    <main>
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="w-full flex flex-col items-center">
            <h1 className="text-[2.8rem] font-bold text-[#07004F] mt-16">
              Event Solutions
            </h1>

            <p className="text-xl font-medium text-[#07004F]">
              An event ticketing solution system
            </p>

            <div className="my-10 hidden md:block">
              <Image
                src="/images/hero-login.svg"
                alt="event solutions"
                width={600}
                height={600}
              />
            </div>

            <p className="text-[#6E6495] hidden md:block">
              Powered by <strong>Tech Know World</strong>
            </p>
          </div>

          <Login />
        </div>
      </div>
    </main>
  );
}
