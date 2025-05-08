import React from "react";
import CardWithImageAndText from "./Card";
import { CodeXml, FolderTree, LayoutDashboard } from "lucide-react";

function MultiCardLayout() {
  return (
    <div className="bg-orangeCustom p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">FEATURES</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center">
        {/* Card 1 */}
        <CardWithImageAndText
          hasImage={false}
          lucideReact={<CodeXml className="mx-auto size-30 mt-3" />}
          heading="Multi-language Support"
          description="EZCode supports JavaScript (.js), TypeScript (.ts), Python (.py), C++ (.cpp), and Java (.java) for flexible coding experiences."
        />
        {/* Card 2 */}
        <CardWithImageAndText
          hasImage={false}
          lucideReact={<FolderTree className="mx-auto size-30 mt-3" />}
          heading="Offers Project Explorer"
          description="EZCode includes a dynamic Project Explorer with full CRUD support for files and folders."
        />
        {/* Card 3 */}
        <CardWithImageAndText
          hasImage={false}
          lucideReact={<LayoutDashboard className="mx-auto size-30 mt-3" />}
          heading="Basic User Interface"
          description="EZCode features a simple and intuitive interface designed for a smooth and focused coding experience."
        />
      </div>
    </div>
  );
}

export default MultiCardLayout;
