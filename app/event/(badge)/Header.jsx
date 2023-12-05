"use client";
import { useEffect, useState } from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Link from "next/link";
import { AiOutlineLogout } from "react-icons/ai";
import TokenService from "@/services/token.service";
import { useQuery } from "@tanstack/react-query";

const Header = ({ isTextWhite = false }) => {
  const { logout, accessToken } = useAuth();
  const api = useAxiosPrivate();

  const [userInfo, _] = useState(() => {
    return TokenService.getTokenInfo(accessToken);
  });

  const { data: companyInfo, isLoading } = useQuery({
    queryKey: ["company-info"],
    queryFn: async () => {
      const res = await api.get("/api/company/info");
      return res.data?.data;
    },
  });

  if (isLoading) return <p className="text-lg text-center">Loading...</p>;

  return (
    <div className={isTextWhite ? "text-white" : "#3F3F3F"}>
      <div className="px-16 pt-8 text-center md:text-left mb-4 md:mb-0">
        <div className="dropdown dropdown-end">
          <button
            type="button"
            tabIndex={0}
            className="flex items-center gap-2 text-base font-semibold"
          >
            <FaUser />
            {userInfo?.username}
            <FaChevronDown className="text-sm" />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
          >
            <li className="text-gray-900">
              <button className="text-base flex items-center" onClick={logout}>
                <AiOutlineLogout />
                logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        {companyInfo?.logoURL && (
          <Image
            className="rounded-md overflow-hidden"
            src={companyInfo?.logoURL}
            height={75}
            width={75}
            alt={companyInfo?.name}
          />
        )}

        <Link href="/event/check-in">
          <h1 className="text-2xl lg:text-4xl font-bold text-center">
            {companyInfo?.name}
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default Header;
