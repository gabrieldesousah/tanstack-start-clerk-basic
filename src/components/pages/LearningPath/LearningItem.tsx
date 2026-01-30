import React from "react";

import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

export const LearningItem = ({
  title,
  content,
}: {
  title: string;
  content: string[];
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Collapsible onOpenChange={setIsOpen} className="space-y-2">
      <CollapsibleTrigger className="flex items-center gap-2 w-full">
        <div className="rounded-md border px-4 py-3 font-mono text-sm flex items-center gap-2 w-full">
          <span>{title}</span>
          {isOpen ? (
            <ChevronsDownUp className="w-4 h-4" />
          ) : (
            <ChevronsUpDown className="w-4 h-4" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 ml-4">
        {content.map((item) => (
          <div
            key={item}
            className="rounded-md border px-4 py-3 font-mono text-sm"
          >
            {item}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
