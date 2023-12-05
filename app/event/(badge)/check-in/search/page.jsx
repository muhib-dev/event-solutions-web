"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsQrCodeScan } from "react-icons/bs";
import { TbUserSearch } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { LuSearchCheck } from "react-icons/lu";
import { catchError } from "@/utils/catchError";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import TicketList from "@/components/tickets/TicketList";
import Link from "next/link";
import toast from "react-hot-toast";
import { encodeURI } from "@/utils/encodeURI";
import Spinner from "@/components/Spinner";

const SearchPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const api = useAxiosPrivate();

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [isFoundTicket, setIsFoundTicket] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [lastDigitPhone, setLastDigitPhone] = useState("");
  const [tickets, setTickets] = useState(null);

  // protected page
  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  //on submit search
  const onSubmitSearch = async (e) => {
    e.preventDefault();

    setLoadingSearch(true);

    try {
      const url = `/api/event-registration/find/${encodeURI(searchText)}`;
      const response = await api.get(url);

      if (response.data.succeeded) {
        setIsFoundTicket(true);
      }
    } catch (error) {
      setIsFoundTicket(false);

      const meassage = catchError(error);
      toast.error(meassage);
    } finally {
      setLoadingSearch(false);
    }
  };

  //on submit verify
  const onSubmitVerify = async (e) => {
    e.preventDefault();

    setLoadingVerify(true);

    try {
      const encodedText = encodeURI(searchText);

      const url = `/api/event-registration/verify-phone/${encodedText}/${lastDigitPhone}`;
      const response = await api.get(url);

      const mappedData = response.data.data.map((item) => ({
        isChecked: item.printCount > 0 ? false : true,
        ...item,
      }));

      setTickets(mappedData);
      setIsFoundTicket(false);
      setLastDigitPhone("");
    } catch (error) {
      const meassage = catchError(error);
      toast.error(meassage);
    } finally {
      setLoadingVerify(false);
    }
  };

  // reset found tickets result
  const onResetFoundTickets = () => {
    setIsFoundTicket(false);
    setTickets(null);
    setSearchText("");
  };

  const isTickets = tickets && tickets?.length > 0;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-5 justify-center items-center my-8">
        <Link href={"/event/check-in/qr-code"}>
          <button type="button" className="btn btn-primary text-white">
            <BsQrCodeScan className="inline-block text-2xl" />
            Check in with QR code
          </button>
        </Link>

        <button
          onClick={onResetFoundTickets}
          type="button"
          className="btn btn-secondary text-white"
        >
          <TbUserSearch className="inline-block text-2xl" />
          Check in with Search
        </button>
      </div>

      {isTickets ? (
        <TicketList tickets={tickets} setTickets={setTickets} />
      ) : (
        <div className="lg:w-1/2 mx-auto mb-8">
          <div className="text-center">
            <p className="text-[17px] text-[#767676]">
              Search by one of the following
            </p>
            <h1 className="text-lg md:text-2xl font-semibold text-[#505050] mt-1">
              Ticket Number, Email, Phone Number
            </h1>
          </div>

          {/* search ticket */}
          <div className="mt-5">
            <form onSubmit={onSubmitSearch}>
              <div className="relative">
                <input
                  className="input !text-xl md:font-bold md:px-4 md:py-6"
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value.trim())}
                  placeholder="Ticket Number, Email, Phone Number"
                  required
                />
                <button
                  type="submit"
                  disabled={loadingSearch}
                  className="absolute top-[0.4rem] md:top-[0.48rem] right-3 bg-[#004FC6] px-4 py-2 text-white text-xl rounded-tr rounded-br disabled:bg-blue-300"
                >
                  {loadingSearch ? <Spinner className="block" /> : <CiSearch />}
                </button>
              </div>
            </form>
          </div>

          {/* found ticket*/}
          {isFoundTicket && (
            <>
              <div className="mt-16 mb-8">
                <h3 className="text-2xl font-bold text-[#10B617] flex items-center gap-2">
                  <LuSearchCheck className="text-3xl" />
                  Ticket Found
                </h3>

                <p className="text-lg text-[#534F4F]">
                  Enter the last 4 digits of your phone number associated with
                  this ticket
                </p>
              </div>

              <form onSubmit={onSubmitVerify}>
                <div className="flex items-center gap-4 max-w-md">
                  <input
                    className="input !text-lg font-bold"
                    type="text"
                    value={lastDigitPhone}
                    onChange={(e) => setLastDigitPhone(e.target.value.trim())}
                    placeholder="Enter the last 4 digits of phone number"
                    title="Enter last 4 digits of phone number"
                    pattern="\d*"
                    maxLength="4"
                    minLength="4"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loadingVerify}
                    className="btn btn-primary bg-[#37529A] text-white"
                  >
                    {loadingVerify && <Spinner className="block" />}
                    <span>Verify Ticket</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
