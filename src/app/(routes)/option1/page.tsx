'use client';
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Check,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  PlaneTakeoff,
  Mail,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const flightTypes = [
  {
    id: "shuttle",
    title: "FLY TO PLAYTIME",
    label: "Shuttle",
    price: 99,
    unit: "/seat / 1-way",
    description: "Хотын төвөөс Festival Main Stage рүү цаг тутам нисэх суудлын нислэг.",
  },
  {
    id: "scenic",
    title: "FLY HIGH PLAYTIME",
    label: "Scenic",
    price: 99,
    unit: "/seat",
    description: "Наадмын талбай, Туул гол, Цонжинболдог орчныг дээрээс харах experience нислэг.",
  },
  {
    id: "charter",
    title: "VIP CLASS",
    label: "Charter",
    price: 1600,
    unit: "/2-way",
    description: "VIP, sponsor болон private group-д зориулсан premium charter үйлчилгээ.",
  },
];

const dates = [
  { id: "2026-07-02", date: "02", month: "Jul", day: "Пүрэв" },
  { id: "2026-07-03", date: "03", month: "Jul", day: "Баасан" },
  { id: "2026-07-04", date: "04", month: "Jul", day: "Бямба" },
];

const times = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const helicopters = [
  {
    id: "h125",
    name: "Airbus H125",
    seats: "1 pilot + 5 pax",
    note: "Хөнгөн, хурдан, богино transfer нислэгт тохиромжтой.",
  },
  {
    id: "h130",
    name: "Airbus H130",
    seats: "1 pilot + 6 pax",
    note: "Panoramic cabin бүхий илүү тав тухтай нислэгийн сонголт.",
  },
];

const steps = [
  { id: 1, title: "Selection" },
  { id: 2, title: "Schedule" },
  { id: 3, title: "Aircraft" },
  { id: 4, title: "Details" },
  { id: 5, title: "Checkout" },
];

export default function FestivalHelicopterBookingUI() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("shuttle");
  const [selectedDate, setSelectedDate] = useState("2026-07-02");
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [selectedHeli, setSelectedHeli] = useState("h125");
  const [passengers, setPassengers] = useState(1);
  const [traveler, setTraveler] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    note: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const type = useMemo(() => flightTypes.find((item) => item.id === selectedType) ?? flightTypes[0], [selectedType]);
  const date = useMemo(() => dates.find((item) => item.id === selectedDate) ?? dates[0], [selectedDate]);
  const heli = useMemo(() => helicopters.find((item) => item.id === selectedHeli) ?? helicopters[0], [selectedHeli]);
  const total = selectedType === "charter" ? type.price : type.price * passengers;

  const nextStep = () => setStep((value) => Math.min(value + 1, steps.length));
  const prevStep = () => {
    if (step === 1) {
      router.push("/");
      return;
    }
    setStep((value) => Math.max(value - 1, 1));
  };

  const completeBooking = async () => {
    setIsPaying(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBookingRef(`PT-${Date.now().toString(36).toUpperCase().slice(-8)}`);
    setIsPaying(false);
    setConfirmOpen(true);
  };

  const handleContinue = () => {
    if (step === steps.length) {
      void completeBooking();
      return;
    }
    nextStep();
  };

  const contactName = [traveler.firstName, traveler.lastName].filter(Boolean).join(" ") || "Guest";

  return (
    <div className="bg-[#f4f7fb] text-slate-950">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-8">
          <div className="grid w-full grid-cols-5">
            {steps.map((item) => {
              const active = item.id === step;
              const done = item.id < step;
              return (
                <button
                  key={item.id}
                  onClick={() => setStep(item.id)}
                  className={`relative flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-3 text-center sm:flex-row sm:gap-2 sm:px-2 sm:py-4 lg:gap-3 lg:py-5 ${active ? "text-slate-950" : "text-slate-500"
                    }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-black sm:h-8 sm:w-8 sm:text-xs lg:h-9 lg:w-9 lg:text-sm ${done
                      ? "bg-blue-600 text-white"
                      : active
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-500"
                      }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" /> : `0${item.id}`}
                  </span>
                  <span className="max-w-full truncate text-xs lg:sm font-bold leading-tight">
                    {item.title}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="step-line"
                      className="absolute inset-x-1 bottom-0 h-1 rounded-full bg-blue-600 sm:inset-x-2 lg:inset-x-4"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 pt-8 ">
        <section className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepPanel key="selection">
                <PanelTitle title="Choose your flight" subtitle="Playtime Festival 2026-д зориулсан нислэгийн төрлөө сонгоно уу." />
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
                  {flightTypes.map((item) => {
                    const selected = item.id === selectedType;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedType(item.id)}
                        className={`cursor-pointer rounded-xl border bg-white p-3 text-left transition-all duration-300 hover:border-blue-400 sm:p-4 lg:p-5 ${selected ? "border-blue-400 shadow-sm" : "border-slate-200"
                          }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4 lg:mb-5">
                          <h3 className="text-base font-black leading-tight sm:text-lg lg:text-xl">
                            {item.title}
                          </h3>
                          <Badge
                            className={`max-w-[120px] truncate text-xs sm:max-w-none sm:text-xs ${selected
                              ? "bg-blue-600"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                              }`}
                          >
                            {item.label}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-sm leading-5 text-slate-500 sm:mt-2 sm:min-h-[44px] sm:text-sm sm:leading-6 lg:min-h-[48px]">
                          {item.description}
                        </p>
                        <div className="mt-1 flex items-end gap-1 sm:mt-5">
                          <span className="text-2xl font-black text-slate-950 sm:text-3xl">
                            ${item.price.toLocaleString()}
                          </span>

                          <span className="pb-0.5 text-xs font-semibold text-slate-400 sm:pb-1 sm:text-sm">
                            {item.unit}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </StepPanel>
            )}

            {step === 2 && (
              <StepPanel key="schedule">
                <PanelTitle title="Select departure" subtitle="7 сарын 2, 3, 4-нд 12:00–17:00 хүртэл цаг тутам нислэгтэй." />
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                  <div className="space-y-2 sm:space-y-3">
                    {dates.map((item) => {
                      const selected = selectedDate === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedDate(item.id)}
                          className={`flex cursor-pointer w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-all duration-200 sm:gap-4 sm:p-4 ${selected
                            ? "border-blue-500 bg-blue-50/40 shadow-sm"
                            : "border-slate-200 hover:border-blue-300"
                            }`}
                        >
                          <div
                            className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg sm:h-16 sm:w-16 sm:rounded-xl ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-950"
                              }`}
                          >
                            <div className="text-center">
                              <p
                                className={`text-[10px] font-bold uppercase leading-none sm:text-xs ${selected ? "text-blue-100" : "text-slate-400"
                                  }`}
                              >
                                {item.month}
                              </p>

                              <p className="mt-1 text-lg font-black leading-none sm:text-2xl">
                                {item.date}
                              </p>
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-slate-950 sm:text-base">
                              2026 оны 7 сарын {Number(item.date)}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                              {item.day}
                            </p>
                          </div>

                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 lg:p-5">
                    <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-400 sm:text-sm">
                          Available times
                        </p>
                        <h3 className="mt-1 text-base font-black leading-tight text-slate-950 sm:text-lg lg:text-xl">
                          Down Town → Festival Main Stage
                        </h3>
                      </div>
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
                        <Clock3 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {times.map((item) => {
                        const selected = selectedTime === item;

                        return (
                          <button
                            key={item}
                            onClick={() => setSelectedTime(item)}
                            className={`rounded-xl border px-2 py-3 text-center text-sm font-black transition-all duration-200 sm:rounded-2xl sm:px-4 sm:py-4 sm:text-base lg:py-5 ${selected
                              ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                              }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </StepPanel>
            )}

            {step === 3 && (
              <StepPanel key="aircraft">
                <PanelTitle title="Choose helicopter" subtitle="Нислэгээ H125 эсвэл H130 нисдэг тэргээр гүйцэтгэхээр сонгоно уу." />
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                  {helicopters.map((item) => {
                    const selected = selectedHeli === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedHeli(item.id)}
                        className={`overflow-hidden rounded-xl border bg-white text-left transition-all duration-300 hover:border-blue-400 ${selected
                          ? "border-blue-500"
                          : "border-slate-200"
                          }`}
                      >
                        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-100 sm:h-40 lg:h-48">
                          <img
                            src="/helicopter.png"
                            alt={item.name}
                            className="absolute inset-0 h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                        <div className="p-4 sm:p-5 lg:p-6">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="truncate text-xl font-black text-slate-950 sm:text-2xl">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                              {item.seats}
                            </p>
                          </div>
                          <p className="mt-3 text-xs leading-5 text-slate-500 sm:mt-4 sm:text-sm sm:leading-6">
                            {item.note}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </StepPanel>
            )}

            {step === 4 && (
              <StepPanel key="traveler">
                <PanelTitle title="Traveler details" subtitle="Захиалга баталгаажуулахад шаардлагатай зорчигчийн мэдээллийг оруулна." />
                <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:gap-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <FormField
                        label="First name"
                        placeholder="Нэр"
                        value={traveler.firstName}
                        onChange={(value) =>
                          setTraveler((prev) => ({ ...prev, firstName: value }))
                        }
                      />
                      <FormField
                        label="Last name"
                        placeholder="Овог"
                        value={traveler.lastName}
                        onChange={(value) =>
                          setTraveler((prev) => ({ ...prev, lastName: value }))
                        }
                      />

                      <FormField
                        label="Phone number"
                        placeholder="+976 99 000 000"
                        value={traveler.phone}
                        onChange={(value) =>
                          setTraveler((prev) => ({ ...prev, phone: value }))
                        }
                        icon={Phone}
                      />

                      <FormField
                        label="Email address"
                        placeholder="name@example.com"
                        value={traveler.email}
                        onChange={(value) =>
                          setTraveler((prev) => ({ ...prev, email: value }))
                        }
                        icon={Mail}
                      />
                    </div>

                    <label className="mt-4 block">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="mb-2 block text-sm font-bold text-slate-700">
                          Зорчигчийн тоо
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                          Max 6
                        </span>
                      </div>

                      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
                        <button
                          type="button"
                          disabled={passengers === 1}
                          onClick={() => setPassengers((v) => Math.max(1, v - 1))}
                          className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl font-black text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
                        >
                          −
                        </button>
                        <div className="flex h-11 items-center justify-center rounded-full bg-white px-4 border border-slate-300">
                          <span className="text-xl font-black text-slate-950">
                            {passengers}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={passengers === 6}
                          onClick={() => setPassengers((v) => Math.min(6, v + 1))}
                          className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-xl font-black text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                        >
                          +
                        </button>
                      </div>
                    </label>
                  </div>
                </div>
              </StepPanel>
            )}

            {step === 5 && (
              <StepPanel key="confirm">
                <PanelTitle title="Review your booking" subtitle="Захиалгын мэдээллээ шалгаад booking request илгээнэ." />
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Booking Reference
                    </p>
                    <p className="mt-1 font-mono text-lg font-black text-slate-900">{bookingRef}</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <ConfirmRow label="Flight" value={type.title} />
                    <ConfirmRow label="Date" value={`Tue, ${date.date} Jul 2026 · ${selectedTime}`} />
                    <ConfirmRow label="Route" value="Down Town → Main Stage" />
                    <ConfirmRow label="Aircraft" value={heli.name} />
                    <ConfirmRow label="Passengers" value={`${passengers}`} />
                    <ConfirmRow label="Contact" value={contactName} />
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-yellow-100 px-4 py-3">
                    <span className="text-sm font-black text-yellow-800">Amount Paid</span>
                    <span className="text-xl font-black text-yellow-900">${total.toLocaleString()}</span>
                  </div>
                </div>
              </StepPanel>
            )}
          </AnimatePresence>

          <div className="sticky bottom-0 z-40 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
              <Button
                variant="outline"
                // disabled={step === 1}
                onClick={prevStep}
                className="h-11 flex-1 rounded-full border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100 sm:h-12 sm:flex-none sm:px-6"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {step === 1 ? "Home" : "Back"}
              </Button>

              <Button
                onClick={handleContinue}
                disabled={isPaying}
                className="h-11 flex-[1.4] rounded-full bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:text-white disabled:opacity-100 sm:h-12 sm:flex-none sm:px-8"
              >
                {isPaying ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Processing payment...
                  </>
                ) : step === steps.length ? (
                  <>
                    Pay Now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[92vw] max-w-sm gap-0 overflow-hidden rounded-[2rem] border-0 p-0">
          <div className="bg-white px-5 py-6 text-center">
            <DialogHeader className="mb-5 items-center text-center">
              <DialogTitle className="text-xl font-black text-slate-950">
                Payment QR
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                QR кодыг уншуулж төлбөрөө төлнө үү
              </DialogDescription>
            </DialogHeader>

            <div className="mx-auto grid aspect-square w-full max-w-[260px] place-items-center rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <img
                src="/qr.png"
                alt="Payment QR"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Amount
            </p>

            <p className="mt-1 text-2xl font-black text-slate-950">
              ${total.toLocaleString()}
            </p>
          </div>
          <DialogFooter className="border-t border-slate-100 bg-white px-5 py-4">
            <div className="grid w-full grid-cols-2 gap-3 px-5 pb-3">
              <Button
                type="button"
                onClick={() => setConfirmOpen(false)}
                variant="outline"
                className="h-11 rounded-full border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </Button>

              <Button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="h-11 rounded-full bg-blue-600 font-bold text-white hover:bg-blue-700"
              >
                Payment check
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StepPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className=" bg-white p-4"
    >
      {children}
    </motion.div>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    </div>
  );
}

function FormField({ label, placeholder, value, onChange, icon: Icon }: { label: string; placeholder: string; value: string; onChange: (value: string) => void; icon?: React.ElementType }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 ${Icon ? "pl-11" : ""}`}
        />
      </div>
    </label>
  );
}

function TimerBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/30">{value}</div>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

function FareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-bold text-slate-900">{value}</span>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 font-black">{value}</p>
    </div>
  );
}

function FlightPoint({ label, time, title, sub, alignRight }: { label: string; time: string; title: string; sub: string; alignRight?: boolean }) {
  return (
    <div className={alignRight ? "text-right" : "text-left"}>
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{time}</p>
      <p className="mt-1 font-bold">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function MiniInfo({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <p className="text-sm font-black">{value}</p>
      </div>
    </div>
  );
}
