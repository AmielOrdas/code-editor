import React from "react";
import CardWithImageAndText from "./Card";

function MultiCardLayout() {
  return (
    <div className="bg-orangeCustom p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">FEATURES</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center">
        {/* Card 1 */}
        <CardWithImageAndText />
        {/* Card 2 */}
        <CardWithImageAndText />
        {/* Card 3 */}
        <CardWithImageAndText />
      </div>
    </div>
  );
}

export default MultiCardLayout;
