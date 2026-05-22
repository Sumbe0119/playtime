"use client";

import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  X,
  Clock3,
  CircleDollarSign,
  Armchair,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  CalendarDays,
  Users,
  Contact,
  Briefcase,
  Luggage,
  Shuffle,
  ChevronDown,
} from "lucide-react";

const flightOptions = [
  {
    id: "shuttle",
    title: "Shuttle flight",
    subtitle: "Per seat",
    price: "99 USD",
    capacity: "up to 5 passengers",
  },
  {
    id: "charter",
    title: "Charter flight",
    subtitle: "Entire helicopter",
    price: "999 - 1,500 USD",
    capacity: "private group",
  },
  {
    id: "scenic",
    title: "Scenic flight",
    subtitle: "Festival aerial view",
    price: "299 USD",
    capacity: "up to 5 passengers",
  },
];

const helicopters = [
  {
    id: "h125",
    name: "H125",
    price: "999USD",
    passengers: "up to 5 passengers",
    payload: "976kg",
    image: "/helicopter.png",
  },
  {
    id: "h130",
    name: "H130",
    price: "1,500USD",
    passengers: "up to 6 passengers",
    payload: "1182kg",
    image: "/helicopter.png",
  },
];

type Step = "options" | "included" | "form" | "date" | "helicopter";

type PlaytimeFlightDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose?: (payload: {
    flightId: string;
    heliId: string;
    date: string;
    time: string;
  }) => void;
};

const TIME_SLOTS = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"] as const;
const FESTIVAL_YEAR = 2026;
const FESTIVAL_MONTH = 6; // July
const DEFAULT_DATE = new Date(FESTIVAL_YEAR, FESTIVAL_MONTH, 2);

const FESTIVAL_DATES = [
  { day: 2, weekday: "Thu", weekdayMn: "Пүрэв" },
  { day: 3, weekday: "Fri", weekdayMn: "Баасан" },
  { day: 4, weekday: "Sat", weekdayMn: "Бямба" },
] as const;

const DEFAULT_FROM = "DownTown";
const DEFAULT_TO = "Playtime";
const FROM_LOCATIONS = [
  "DownTown",
  "City Center",
  "River Plaza",
  "Bogd Khan",
  "Sky Resort",
] as const;
const TO_LOCATIONS = ["Playtime"] as const;
const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

type FormPicker = "from" | "to" | "passengers" | "contact" | null;

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatSelectedDate(date: Date, time: string) {
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${time}`;
}

const STEP_TITLES: Record<Step, string> = {
  options: "Playtime Festival Flight",
  included: "Airport shuttle flight",
  form: "Shared flight",
  date: "Date and Time",
  helicopter: "Helicopter choice",
};

const BookingDialog = ({
  open,
  onOpenChange,
  onChoose,
}: PlaytimeFlightDialogProps) => {
  const [step, setStep] = React.useState<Step>("options");
  const [selectedFlight, setSelectedFlight] = React.useState("shuttle");
  const [selectedHeli, setSelectedHeli] = React.useState("h125");
  const [selectedDate, setSelectedDate] = React.useState(DEFAULT_DATE);
  const [selectedTime, setSelectedTime] = React.useState<string>("12:00");
  const [formFrom, setFormFrom] = React.useState(DEFAULT_FROM);
  const [formTo, setFormTo] = React.useState(DEFAULT_TO);
  const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false);
  const closingConfirmedRef = React.useRef(false);

  const [passengers, setPassengers] = React.useState(0);
  const [contactName, setContactName] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [activePicker, setActivePicker] = React.useState<FormPicker>(null);

  const contactSummary =
    contactName && contactPhone
      ? `${contactName} · ${contactPhone}`
      : contactName || contactPhone || "";

  const resetDialog = () => {
    setStep("options");
    setSelectedFlight("shuttle");
    setSelectedHeli("h125");
    setSelectedDate(DEFAULT_DATE);
    setSelectedTime("12:00");
    setFormFrom(DEFAULT_FROM);
    setFormTo(DEFAULT_TO);
    setCloseConfirmOpen(false);
    setPassengers(0);
    setContactName("");
    setContactPhone("");
    setTermsAccepted(false);
    setActivePicker(null);
  };

  const handleOpenChange = (
    nextOpen: boolean,
    eventDetails?: { reason?: string },
  ) => {
    if (nextOpen) {
      setCloseConfirmOpen(false);
      onOpenChange(true);
      return;
    }

    if (closingConfirmedRef.current) {
      closingConfirmedRef.current = false;
      onOpenChange(false);
      resetDialog();
      return;
    }

    const reason = eventDetails?.reason;
    const isIntentionalClose =
      reason === "escapeKey" ||
      reason === "closePress" ||
      reason === "outsidePress";

    if (!isIntentionalClose) return;

    setCloseConfirmOpen(true);
  };

  const requestClose = () => {
    setCloseConfirmOpen(true);
  };

  const cancelClose = () => {
    setCloseConfirmOpen(false);
  };

  const confirmClose = () => {
    setCloseConfirmOpen(false);
    closingConfirmedRef.current = true;
    onOpenChange(false);
    resetDialog();
  };

  const goBack = () => {
    const backMap: Partial<Record<Step, Step>> = {
      included: "options",
      form: "included",
      date: "form",
      helicopter: "form",
    };
    const prev = backMap[step];
    if (prev) setStep(prev);
  };

  const handleChooseOption = (id: string) => {
    setSelectedFlight(id);
    setStep("included");
  };

  const completeBooking = () => {
    onChoose?.({
      flightId: selectedFlight,
      heliId: selectedHeli,
      date: toDateKey(selectedDate),
      time: selectedTime,
    });
    closingConfirmedRef.current = true;
    onOpenChange(false);
    resetDialog();
  };

  const title = STEP_TITLES[step];
  const isSharedFlight = selectedFlight === "shuttle" || selectedFlight === "scenic";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-40px)] w-[92vw] max-w-[420px] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl"
      >
        {closeConfirmOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
            <div className="w-full max-w-[300px] rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="text-lg font-black text-slate-950">Close booking?</h3>
              <DialogDescription className="mt-2 text-sm text-slate-500">
                Та захиалгаа хаах уу? Оруулсан мэдээлэл устгагдана.
              </DialogDescription>
              <div className="mt-5 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelClose}
                  className="h-11 flex-1 rounded-lg font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmClose}
                  className="h-11 flex-1 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
        <DialogHeader className="relative shrink-0 border-b border-slate-200 px-5 py-5 text-left">
          <div className="flex items-center gap-3">
            {step !== "options" && (
              <button
                type="button"
                onClick={goBack}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-800 transition hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            <DialogTitle className="pr-10 text-xl font-black text-slate-950">
              {title}
            </DialogTitle>
          </div>

          <button
            type="button"
            onClick={requestClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {step === "options" && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="relative h-[200px] shrink-0 overflow-hidden bg-blue-50">
              <Image
                width={420}
                height={200}
                src="/dialog-banner.png"
                alt="Ulaanbaatar city center to Playtime Festival route"
                className="h-full w-full object-cover"
              />

              <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-blue-700 shadow-sm">
                DownTown → Playtime Main Stage
              </div>

              <div className="absolute bottom-8 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-lg">
                <Clock3 className="h-4 w-4" />
                from 7 min
              </div>
            </div>

            <div className="-mt-5 space-y-3 bg-gray-200 px-4 pb-5">
              {flightOptions.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-xl bg-white shadow-lg"
                  >
                    <div className="p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-black leading-tight text-slate-950">
                            {item.title}
                            <span className="ml-1 text-sm font-semibold text-slate-500">
                              ({item.subtitle})
                            </span>
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <CircleDollarSign className="h-4 w-4 text-slate-500" />
                          {item.price}
                        </div>

                        <div className="flex items-center gap-2 font-semibold text-slate-600">
                          <Armchair className="h-4 w-4 text-slate-500" />
                          {item.capacity}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleChooseOption(item.id)}
                      className="h-12 w-full rounded-none bg-blue-600 text-sm font-black text-white hover:bg-blue-700"
                    >
                      Choose
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "included" && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-center gap-8 border-b border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setSelectedFlight("shuttle")}
                className={`flex items-center gap-2 text-sm font-bold ${isSharedFlight ? "text-blue-600" : "text-slate-800"
                  }`}
              >
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full ${isSharedFlight ? "border-4 border-blue-600" : "border-2 border-slate-700"
                    }`}
                />
                Shared flight
              </button>

              <button
                type="button"
                onClick={() => setSelectedFlight("charter")}
                className={`flex items-center gap-2 text-sm font-bold ${selectedFlight === "charter" ? "text-blue-600" : "text-slate-800"
                  }`}
              >
                <span
                  className={`h-5 w-5 rounded-full ${selectedFlight === "charter"
                    ? "border-4 border-blue-600"
                    : "border-2 border-slate-700"
                    }`}
                />
                Private flight
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <h3 className="mb-4 text-lg font-black text-slate-900">
                Included
              </h3>

              <div className="space-y-5">
                <InfoLine
                  title="Business class check-in"
                  description="If you have an economy seat, you will check in as business class."
                />

                <div className="border-t border-slate-200 pt-4">
                  <InfoLine
                    title="Helipad choice"
                    description="River Plaza, Bogd Khan, Alpha Aurora aviation, Khiimori khothon, Intermed, Yargait, Sky Resort"
                  />
                </div>
              </div>

              <h3 className="mt-6 text-lg font-black text-slate-900">
                Check-in Luggage
              </h3>

              <div className="mt-3">
                <InfoLine
                  title="Your seat includes only 12kg allowance in total across two bags"
                  description=""
                />

                <div className="ml-9 mt-5 space-y-4">
                  <LuggageRow
                    icon={Briefcase}
                    title="Personal item"
                    sub="Max 13cm x 13 cm x 13 cm"
                  />
                  <LuggageRow
                    icon={Luggage}
                    title="Carry-on sized item"
                    sub="Max 56 cm x 41 cm x 23 cm"
                  />
                </div>
              </div>
            </div>

            <BottomButton onClick={() => setStep("form")}>Continue</BottomButton>
          </div>
        )}

        {step === "form" && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-4 grid grid-cols-[1fr_36px_1fr] items-center gap-2">
                <FormField
                  icon={MapPin}
                  placeholder="From"
                  value={formFrom}
                  onClick={() =>
                    setActivePicker((prev) => (prev === "from" ? null : "from"))
                  }
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextFrom = formTo;
                    const nextTo = formFrom;
                    setFormFrom(nextFrom);
                    setFormTo(nextTo);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                  aria-label="Swap locations"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <FormField
                  icon={MapPin}
                  placeholder="To"
                  value={formTo}
                  onClick={() =>
                    setActivePicker((prev) => (prev === "to" ? null : "to"))
                  }
                />
              </div>

              {activePicker === "from" && (
                <OptionPicker
                  options={FROM_LOCATIONS}
                  onSelect={(value) => {
                    setFormFrom(value);
                    setActivePicker(null);
                  }}
                />
              )}

              {activePicker === "to" && (
                <OptionPicker
                  className="mb-4"
                  options={TO_LOCATIONS}
                  onSelect={(value) => {
                    setFormTo(value);
                    setActivePicker(null);
                  }}
                />
              )}

              <div className="space-y-4">
                <FormField
                  icon={CalendarDays}
                  placeholder="Date and Time"
                  value={formatSelectedDate(selectedDate, selectedTime)}
                  onClick={() => {
                    setActivePicker(null);
                    setStep("date");
                  }}
                />
                <FormField
                  icon={Users}
                  placeholder="Passengers"
                  value={
                    passengers > 0
                      ? `${passengers} passenger${passengers > 1 ? "s" : ""}`
                      : undefined
                  }
                  onClick={() =>
                    setActivePicker((prev) =>
                      prev === "passengers" ? null : "passengers",
                    )
                  }
                />
                {activePicker === "passengers" && (
                  <OptionPicker
                    options={PASSENGER_OPTIONS.map(
                      (n) => `${n} passenger${n > 1 ? "s" : ""}`,
                    )}
                    onSelect={(value) => {
                      setPassengers(Number.parseInt(value, 10));
                      setActivePicker(null);
                    }}
                  />
                )}
                <FormField
                  icon={Contact}
                  placeholder="Contact Information"
                  value={contactSummary}
                  onClick={() =>
                    setActivePicker((prev) =>
                      prev === "contact" ? null : "contact",
                    )
                  }
                />
                {activePicker === "contact" && (
                  <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Full name"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+976 99 000 000"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <Button
                      type="button"
                      onClick={() => setActivePicker(null)}
                      className="h-10 w-full rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
                    >
                      Save contact
                    </Button>
                  </div>
                )}
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-md border-2 transition",
                    termsAccepted
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 bg-white",
                  )}
                >
                  {termsAccepted && <Check className="h-4 w-4" />}
                </span>
                <span
                  className={cn(
                    "underline",
                    termsAccepted ? "font-semibold text-blue-700" : "text-blue-600",
                  )}
                >
                  Terms and Conditions
                </span>
              </label>

              <div className="mt-24 border-t border-slate-200 pt-6 text-center">
                <p className="text-base font-black text-slate-800">
                  Total Amout (USD)
                </p>
                <p className="mt-1 text-5xl font-black text-blue-600">0$</p>
              </div>
            </div>

            <BottomButton onClick={() => setStep("helicopter")}>
              Continue
            </BottomButton>
          </div>
        )}

        {step === "date" && (
          <BookingDateStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            onContinue={() => setStep("form")}
          />
        )}

        {step === "helicopter" && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4">
              <div className="space-y-5">
                {helicopters.map((item) => {
                  const selected = selectedHeli === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-xl border bg-white text-left shadow-lg transition-all duration-300 ${selected ? "border-blue-500" : "border-slate-200"
                        }`}
                    >
                      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 sm:h-40">
                        <div className="absolute -right-4 bottom-3 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white/95 px-3 py-1.5 text-center text-base font-black text-slate-950 shadow-sm">
                          {item.name}
                        </div>
                        <Image
                          width={420}
                          height={200}
                          src={item.image}
                          alt={item.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      </div>

                      <div className="p-4">
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 font-black text-slate-800">
                            <CircleDollarSign className="h-4 w-4 text-slate-700" />
                            {item.price}
                          </div>

                          <div className="flex items-center gap-2 font-semibold text-slate-700">
                            <Armchair className="h-4 w-4 text-slate-700" />
                            {item.passengers}
                          </div>

                          <div className="col-span-2 flex items-center gap-2 font-semibold text-slate-700">
                            <Luggage className="h-4 w-4 text-slate-700" />
                            payload{" "}
                            <span className="font-black">{item.payload}</span>
                            <span className="text-xs text-slate-500">
                              (Passengers and luggages)
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={() => setSelectedHeli(item.id)}
                        className={`h-12 w-full rounded-none text-sm font-black text-white ${selected
                          ? "bg-blue-700"
                          : "bg-blue-600 hover:bg-blue-700"
                          }`}
                      >
                        {selected ? "Selected" : "Select"}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <BottomButton onClick={completeBooking}>Confirm Booking</BottomButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;

function BookingDateStep({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onContinue,
}: {
  selectedDate: Date;
  selectedTime: string;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <div className="mb-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Playtime Festival 2026
            </p>
            <h3 className="text-lg font-black text-slate-900">July 2026</h3>
            <p className="mt-1 text-sm text-slate-500">
              7 сарын 2, 3, 4-нд нислэгтэй
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {FESTIVAL_DATES.map((item) => {
              const date = new Date(FESTIVAL_YEAR, FESTIVAL_MONTH, item.day);
              const selected = isSameDay(date, selectedDate);

              return (
                <button
                  key={item.day}
                  type="button"
                  onClick={() => onSelectDate(date)}
                  className={`flex flex-col items-center rounded-2xl border px-2 py-4 transition ${selected
                    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                >
                  <span
                    className={`text-[11px] font-bold uppercase ${selected ? "text-blue-100" : "text-slate-400"
                      }`}
                  >
                    {item.weekday}
                  </span>
                  <span className="mt-1 text-3xl font-black leading-none">
                    {item.day}
                  </span>
                  <span
                    className={`mt-2 text-xs font-semibold ${selected ? "text-blue-100" : "text-slate-500"
                      }`}
                  >
                    {item.weekdayMn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black text-slate-900">Departure time</p>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              {selectedTime}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((time) => {
              const active = selectedTime === time;

              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => onSelectTime(time)}
                  className={`rounded-xl border px-3 py-3 text-sm font-black transition ${active
                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Selected
          </p>
          <p className="mt-1 text-sm font-black text-slate-900">
            {formatSelectedDate(selectedDate, selectedTime)}
          </p>
        </div>
      </div>

      <BottomButton onClick={onContinue}>Continue</BottomButton>
    </div>
  );
}

function InfoLine({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        {description && (
          <p className="mt-1 text-sm italic leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function LuggageRow({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
      <div>
        <p className="text-sm text-slate-700">{title}</p>
        <p className="text-sm italic text-slate-500">{sub}</p>
      </div>
    </div>
  );
}

function FormField({
  icon: Icon,
  placeholder,
  value,
  onClick,
}: {
  icon: React.ElementType;
  placeholder: string;
  value?: string;
  onClick?: () => void;
}) {
  const filled = Boolean(value?.trim());

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-12 w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition",
        filled
          ? "border-blue-300 bg-blue-50 shadow-sm ring-1 ring-blue-100"
          : "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            filled ? "text-blue-600" : "text-slate-400",
          )}
        />
        <div className="min-w-0 text-left">
          {filled ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600">
                {placeholder}
              </p>
              <p className="truncate text-sm font-bold text-slate-900">{value}</p>
            </>
          ) : (
            <span className="text-sm text-slate-400">{placeholder}</span>
          )}
        </div>
      </div>
      {filled ? (
        <Check className="h-4 w-4 shrink-0 text-blue-600" />
      ) : (
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      )}
    </button>
  );
}

function OptionPicker({
  options,
  onSelect,
  className,
}: {
  options: readonly string[];
  onSelect: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function BottomButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div className="shrink-0 bg-white px-5 pb-4 pt-3">
      <Button
        type="button"
        onClick={onClick}
        className="h-12 w-full rounded-lg bg-blue-600 text-sm font-black text-white hover:bg-blue-700"
      >
        {children}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}