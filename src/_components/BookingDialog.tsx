import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  PlaneTakeoff,
  Clock3,
  CircleDollarSign,
  Armchair,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

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

type PlaytimeFlightDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose?: (id: string) => void;
};

const BookingDialog = ({
  open,
  onOpenChange,
  onChoose,
}: PlaytimeFlightDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-100px)] w-[92vw] max-w-[420px] flex-col gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl"
      >
        <DialogHeader className="relative shrink-0 px-5 py-5 text-left">
          <DialogTitle className="pr-10 text-xl font-black text-slate-950">
            Playtime Festival Flight
          </DialogTitle>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

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
              City Center → Playtime
            </div>

            <div className="absolute bottom-8 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-black text-white shadow-lg">
              <Clock3 className="h-4 w-4" />
              from 7 min
            </div>
          </div>

          <div className="-mt-5 space-y-3 px-4 pb-5 bg-gray-200">
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
                    onClick={() => onChoose?.(item.id)}
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
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;