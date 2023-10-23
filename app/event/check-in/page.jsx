"use client";
import "@/styles/check-in.css";
import Link from "next/link";
import { BsQrCodeScan } from "react-icons/bs";
import { TbUserSearch } from "react-icons/tb";
import Header from "../(badge)/Header";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CheckInPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // protected page
  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  return (
    <div className="custom-gradient-bg min-h-screen px-4 lg:px-0">
      <Header isTextWhite />

      <div className="flex flex-col items-center">
        <div className="text-white text-center">
          <h2 className="text-3xl md:text-3xl font-semibold mt-10 md:mt-20">
            Session Check-in
          </h2>
          <p className="md:text-xl mt-2">
            Choose an option to check in and print badge
          </p>
        </div>

        <div className="text-white flex flex-col md:flex-row gap-8 mt-8 md:mt-16">
          <Link href={"/event/check-in/qr-code"}>
            <div className="bg-[#47436D] rounded-[15px] p-10 shadow-[1px_5px_15px_#00000024] text-center">
              <BsQrCodeScan className="inline-block text-6xl" />
              <h3 className="text-2xl lg:text-3xl font-semibold mt-5">
                Check in with QR code
              </h3>
              <p className="mt-2 text-lg">Badge QR code</p>
            </div>
          </Link>

          <Link href={"/event/check-in/search"}>
            <div className="bg-[#47436D] rounded-[15px] p-10 shadow-[1px_5px_15px_#00000024] text-center">
              <TbUserSearch className="inline-block text-6xl" />
              <h3 className="text-2xl lg:text-3xl font-semibold mt-5">
                Check in with Search
              </h3>
              <p className="mt-2 text-lg">
                Email, Mobile no. and Ticket Number
              </p>
            </div>
          </Link>
        </div>
      </div>

      <p className="text-[#6E6495] text-center mt-20">
        Powered by <strong>Tech Know World</strong>
      </p>
    </div>
  );
};

export default CheckInPage;
