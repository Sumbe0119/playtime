"use client";

import React, { useState } from "react";
import BookingDialog from "./BookingDialog";

const options = [
  {
    id: 1,
    name: "Option 1",
    url: "/option1",
    description: "Start with the first playtime mode",
    opensDialog: false,
  },
  {
    id: 2,
    name: "Option 2",
    url: "/option2",
    description: "Choose another playtime experience",
    opensDialog: true,
  },
];

const optionCardClassName =
  "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/[0.07] w-full text-left";

function OptionCardContent({ option }: { option: (typeof options)[number] }) {
  return (
    <>
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20" />

      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20">
            {option.id}
          </div>

          <h2 className="text-xl font-semibold text-white">{option.name}</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">{option.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-300">Continue</span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </>
  );
}

const Options = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0b0f19] px-4 text-white">
        <div className="w-full max-w-3xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium tracking-[0.25em] text-blue-400 uppercase">
              Choose Mode
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Playtime Options</h1>

            <p className="mt-4 text-sm text-slate-400 md:text-base">
              Select one of the available options to continue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {options.map((option) =>
              option.opensDialog ? (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className={optionCardClassName}
                >
                  <OptionCardContent option={option} />
                </button>
              ) : (
                <a key={option.id} href={option.url} className={optionCardClassName}>
                  <OptionCardContent option={option} />
                </a>
              ),
            )}
          </div>
        </div>
      </div>

      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onChoose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default Options;
