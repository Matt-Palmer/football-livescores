"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { DayPicker } from "react-day-picker";

import { getTodaysDate, parseCalendarDate } from "@/services/Date";

type Props = {
  selectedDate: string;
  onSelect: (date: string) => void;
};

/*
  react-day-picker ships its own stylesheet, deliberately not imported here —
  this app has no other component styled that way, and importing it would
  mean fighting its defaults with overrides instead of styling it directly
  through `classNames`, the mechanism the library provides for exactly this.
*/
const dayPickerClassNames = {
  chevron: "w-4 h-4 fill-current text-white",
  month_caption: "flex justify-center items-center py-1",
  caption_label: "text-sm font-medium",
  nav: "flex items-center justify-between absolute inset-x-1 top-1",
  button_previous: "p-1 rounded hover:bg-white/10 disabled:opacity-30",
  button_next: "p-1 rounded hover:bg-white/10 disabled:opacity-30",
  month_grid: "w-full border-collapse mt-1 table-fixed",
  // Weekday/day cells are real <th>/<td> elements — centered with
  // text-align/align-middle rather than flex, which would knock them out of
  // table layout and stack every cell in the row vertically instead.
  weekday:
    "h-8 text-xs font-normal text-[rgba(255,255,255,0.6)] text-center align-middle",
  day: "w-8 h-8 p-0 text-center align-middle text-sm",
  day_button: "w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center",
  selected: "[&>button]:bg-[#EFEF3E] [&>button]:text-black [&>button]:hover:bg-[#EFEF3E]",
  today: "[&>button]:text-[#EFEF3E] [&>button]:font-semibold",
  outside: "[&>button]:text-[rgba(255,255,255,0.3)]",
};

function DateCalendar({ selectedDate, onSelect }: Props) {
  return (
    <Popover className="relative">
      <PopoverButton
        aria-label="Choose a date"
        className="p-1 rounded-full hover:bg-white/10 flex items-center"
      >
        <CalendarDaysIcon className="w-5 h-5" />
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="z-10 [--anchor-gap:6px] rounded-lg bg-[#3F576C] p-3 shadow-lg"
      >
        {({ close }) => (
          <DayPicker
            mode="single"
            selected={parseCalendarDate(selectedDate)}
            onSelect={(date) => {
              if (!date) return;

              onSelect(getTodaysDate(date));
              close();
            }}
            classNames={dayPickerClassNames}
          />
        )}
      </PopoverPanel>
    </Popover>
  );
}

export default DateCalendar;
