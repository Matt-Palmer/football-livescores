import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden px-4 mx-auto mb-16">
      <div className="flex h-[20px] w-1/3 mb-2">
        <div className="h-full w-[20px] mr-2 animate-pulse bg-[#152420]"></div>
        <div className="h-full w-full animate-pulse bg-[#152420]"></div>
      </div>
      <div className="flex h-[20px] w-1/3 animate-pulse bg-[#152420] mb-8"></div>
      <div className="flex h-[60px] w-full justify-center">
        <div className="flex items-center gap-4">
          <div className="h-[60px] w-[60px] animate-pulse bg-[#152420]"></div>
          <div className="h-[40px] w-[90px] animate-pulse bg-[#152420]"></div>
          <div className="h-[60px] w-[60px] animate-pulse bg-[#152420]"></div>
        </div>
      </div>

      <div className="flex h-[30px] md:h-[40px] w-full gap-4 justify-center my-8">
        <div className="h-full flex-1 animate-pulse bg-[#152420]"></div>
        <div className="h-full flex-1 animate-pulse bg-[#152420]"></div>
        <div className="h-full flex-1 animate-pulse bg-[#152420]"></div>
        <div className="h-full flex-1 animate-pulse bg-[#152420]"></div>
        <div className="h-full flex-1 animate-pulse bg-[#152420]"></div>
      </div>

      <div className="flex flex-col gap-1 max-w-[700px]">
        {Array.from({ length: 10 }).map((item, index) => (
          <div
            key={index}
            className="bg-[#152420] animate-pulse h-[40px] md:h-[44px] w-full mb-1"
          ></div>
        ))}
      </div>
    </div>
  );
}
