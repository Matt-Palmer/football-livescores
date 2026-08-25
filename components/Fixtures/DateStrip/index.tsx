"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { useFixturesContext } from "@/hooks/useFixturesContext";
import { addDays, getDayStripLabel, getTodaysDate } from "@/services/Date";

import DateCalendar from "./DateCalendar";

function DateStrip() {
  const { selectedDate, isToday, goToDate } = useFixturesContext();

  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        onClick={() => goToDate(addDays(selectedDate, -1))}
        aria-label="Previous day"
        className="p-2 rounded-full hover:bg-white/10"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm md:text-base font-light w-24 md:w-28 text-center">
          {getDayStripLabel(selectedDate)}
        </span>

        <DateCalendar selectedDate={selectedDate} onSelect={goToDate} />

        {!isToday && (
          <button
            type="button"
            onClick={() => goToDate(getTodaysDate())}
            className="text-xs px-2 py-1 rounded-full border border-[#C9A15A] text-[#C9A15A]"
          >
            Today
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => goToDate(addDays(selectedDate, 1))}
        aria-label="Next day"
        className="p-2 rounded-full hover:bg-white/10"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default DateStrip;
