"use client";

import React, { useState } from "react";
import Link from "next/link";
import BookingDialog from "@/_components/BookingDialog";

export default function Option2Page() {
  const [dialogOpen, setDialogOpen] = useState(true);

  return (
    <div className="h-screen bg-[#0b0f19] relative">
      {!dialogOpen && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center text-white">
          <p className="text-slate-400">Booking dialog closed</p>
          <Link
            href="/"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Back to options
          </Link>
        </div>
      )}

      <BookingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
