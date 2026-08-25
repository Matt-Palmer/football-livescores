import React from "react";
import CountryListItem from "./CountryListItem";
import DateStrip from "./DateStrip";

function FixturesComponent() {
  return (
    <main className="px-6 mb-16 flex flex-col justify-center items-center">
      <div className="w-full max-w-[500px] lg:max-w-[600px]">
        <DateStrip />
        <CountryListItem />
      </div>
    </main>
  );
}

export default FixturesComponent;
