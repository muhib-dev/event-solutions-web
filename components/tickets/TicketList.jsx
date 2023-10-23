"use client";
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { BsTelephone } from "react-icons/bs";
import { CiMail } from "react-icons/ci";
import { MdPrint } from "react-icons/md";
import Modal from "../Modal";
import QRCode from "react-qr-code";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import toast from "react-hot-toast";

const TicketList = ({ tickets, setTickets }) => {
  const api = useAxiosPrivate();

  const [openModal, setOpenModal] = useState(false);
  const [printableTickets, setPrintableTickets] = useState(null);

  const printableComponentRef = useRef();
  const promiseResolveRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // call promise resolve
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  // handle confirm print
  const handlePrint = useReactToPrint({
    content: () => printableComponentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: async () => {
      if (!printableTickets) return toast.error("No printable tickets found!");

      const ticketKeys = printableTickets.map((item) => item.uniqueKey);

      try {
        await api.post("/api/event-registration/ticket/print", { ticketKeys });
      } catch (error) {
        console.log(error);
      } finally {
        // Reset the Promise resolve to print again
        promiseResolveRef.current = null;
        setIsPrinting(false);
      }
    },
  });

  // on check ticket
  const onChangeCheckTicket = (evt, index) => {
    setTickets((prev) => {
      const updatedTickets = [...prev];
      updatedTickets[index].isChecked = evt.target.checked;
      return updatedTickets;
    });
  };

  // on print single
  const onPrintSingle = (index) => {
    const selectedTicket = { ...tickets[index] };

    setPrintableTickets([selectedTicket]);
    setOpenModal(true);
  };

  const selectedTickets = tickets.filter((item) => item.isChecked);
  const totalSelectedTickets = selectedTickets.length;

  // on print selected tickets
  const onPrintSelectedTickets = () => {
    setPrintableTickets(selectedTickets);
    setOpenModal(true);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-[#3CA119] text-center mb-6">
        {tickets?.length} Ticket(s) Found!
      </h1>

      <ul className="flex flex-col">
        {tickets.map((item, index) => (
          <li
            key={item.ticketKey}
            className="flex items-center justify-between py-6 px-4 border-b last:border-0"
          >
            <div>
              <div className="flex gap-3 items-center">
                <input
                  disabled={item.printCount > 0}
                  id={item.ticketKey}
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={(e) => onChangeCheckTicket(e, index)}
                  className="checkbox rounded-full checkbox-lg"
                />
                <label
                  htmlFor={item.ticketKey}
                  className="text-2xl font-bold text-[#3E3E3E] cursor-pointer"
                >
                  {item.ticketOwnerName}
                </label>
                <em className="text-base font-normal text-[#6C6B6B]">
                  {item.ticketCategory}
                </em>
              </div>

              <div className="ml-[2.8rem] flex items-center gap-4 text-[#5B5B5B]">
                {item?.ticketOwnerEmail ? (
                  <div className="flex items-center gap-2 mt-3">
                    <CiMail />
                    {item.ticketOwnerEmail}
                  </div>
                ) : null}

                {item?.ticketOwnerPhone ? (
                  <div className="flex items-center gap-2 mt-3">
                    <BsTelephone />
                    {item.ticketOwnerPhone}
                  </div>
                ) : null}
              </div>
            </div>

            {item.printCount > 0 ? (
              <button
                disabled
                className="btn btn-outline  text-base disabled:text-gray-500"
                type="button"
              >
                Printed: {item.printCount}
                <MdPrint className="text-xl" />
              </button>
            ) : (
              <button
                onClick={() => onPrintSingle(index)}
                className="btn hover:bg-secondary hover:border-secondary btn-outline text-base text-[#3E7AD3]"
                type="button"
              >
                Print
                <MdPrint className="text-xl" />
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="flex justify-end my-8 px-4">
        <button
          onClick={onPrintSelectedTickets}
          disabled={totalSelectedTickets < 1}
          className="btn btn-secondary"
        >
          {totalSelectedTickets > 0
            ? `Print ${totalSelectedTickets} Ticket(s)`
            : "Select Ticket To Print"}

          <MdPrint className="text-xl" />
        </button>
      </div>

      <Modal open={openModal}>
        <div
          ref={printableComponentRef}
          className="max-h-[50vh] print:max-h-full overflow-y-auto scroll-smooth"
        >
          {printableTickets &&
            printableTickets.map((item) => (
              <div
                className="flex flex-col items-center gap-4 mt-6"
                key={item.ticketKey}
              >
                <h1 className="text-2xl font-bold">{item.ticketOwnerName}</h1>
                <QRCode size={150} value={item.ticketOwnerName} />
              </div>
            ))}
        </div>

        <div className="modal-action gap-2 print:hidden">
          <button onClick={() => setOpenModal(false)} className="btn">
            Close
          </button>

          <button
            disabled={isPrinting}
            onClick={handlePrint}
            className="btn btn-success"
          >
            {isPrinting ? (
              "Badge Printing"
            ) : (
              <>
                <MdPrint className="text-xl" /> <span>Confirm Print</span>
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default TicketList;
