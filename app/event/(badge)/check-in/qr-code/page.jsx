"use client";
import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BsQrCodeScan } from "react-icons/bs";
import { TbUserSearch } from "react-icons/tb";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { catchError } from "@/utils/catchError";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import TicketList from "@/components/tickets/TicketList";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import toast from "react-hot-toast";

const config = {
  fps: 10,
  qrbox: { width: 500, height: 450 },
  aspectRatio: 1,
};

const elementScanner = "render-qr-code";

const QrCodePage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const api = useAxiosPrivate();
  const html5QrCode = useRef(null);

  const [isNotPermission, setIsNotPermission] = useState(false);
  const [scanResultLoading, setScanResultLoading] = useState(false);
  const [tickets, setTickets] = useState(null);

  // check camera Permission
  const checkCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setIsNotPermission(false);
    } catch (error) {
      setIsNotPermission(true);
      console.log(error);
    }
  };

  // protected page
  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  // on success scanner
  const onSuccessScan = useCallback(
    async (code) => {
      try {
        setScanResultLoading(true);

        const url = `/api/event-registration/qr-code/${code}`;
        const response = await api.get(url);
        const mappedData = response.data.data.map((item) => ({
          isChecked: item.printCount > 0 ? false : true,
          ...item,
        }));

        setTickets(mappedData);
        html5QrCode.current.stop();
      } catch (error) {
        console.log(error);
        const meassage = catchError(error);
        toast.error(meassage);
      } finally {
        setScanResultLoading(false);
      }
    },
    [api]
  );

  // start Scan
  const startScan = useCallback(async () => {
    if (!html5QrCode.current.isScanning) {
      html5QrCode.current.start(
        { facingMode: "environment" },
        config,
        onSuccessScan,
        (error) => console.log(error)
      );
    }
  }, [onSuccessScan]);

  // initialize QR code
  useEffect(() => {
    if (!html5QrCode.current) {
      html5QrCode.current = new Html5Qrcode(elementScanner, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      });
    }

    checkCameraPermission();
    startScan();

    return () => {
      if (html5QrCode.current.isScanning) {
        html5QrCode.current
          .stop()
          .then(() => console.log("Stop scanner"))
          .catch((error) => console.log(error));
      }
    };
  }, [startScan]);

  // reset found tickets result
  const onResetFoundTickets = () => {
    setTickets(null);
    startScan();
  };

  const isTickets = tickets && tickets.length > 0;

  return (
    <div className="container mx-auto">
      <div className="flex gap-5 justify-center items-center mt-8 mb-6">
        <button
          onClick={onResetFoundTickets}
          type="button"
          className="btn btn-primary text-white"
        >
          <BsQrCodeScan className="inline-block text-2xl" />
          Check in with QR code
        </button>

        <Link href="/event/check-in/search">
          <button className="btn btn-secondary text-white">
            <TbUserSearch className="inline-block text-2xl" />
            Check in with Search
          </button>
        </Link>
      </div>

      {isTickets && <TicketList tickets={tickets} setTickets={setTickets} />}

      <div className="lg:w-1/2 max-h-40 mx-auto">
        {scanResultLoading && (
          <div className="flex justify-center items-center gap-3">
            <Spinner /> <p>loading...</p>
          </div>
        )}

        <div className="shadow rounded overflow-hidden my-6">
          {isNotPermission && (
            <div className="text-center px-5 py-6">
              <p className="text-red-600 text-xl mb-4">
                Camera permission denied. Please allow camera to scan qrcode.
                You can change this in your browser settings
              </p>
            </div>
          )}

          <div id={elementScanner}></div>
        </div>
      </div>
    </div>
  );
};

export default QrCodePage;
