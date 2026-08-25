import React from "react";
import LeagueDashboard from "@/components/Fixtures/LeagueDashboard";
import DateStrip from "./DateStrip";

function FixturesComponent() {
  return (
    <main className="px-4 md:px-6 mb-16">
      <div className="w-full max-w-[1600px] mx-auto">
        <DateStrip />
        <LeagueDashboard />
      </div>
    </main>
  );
}

export default FixturesComponent;
