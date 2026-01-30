import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const EnglishLevel = () => {
  const [englishLevel, setEnglishLevel] = React.useState("");

  const handleEnglishLevelChange = (newLevel: string) => {
    setEnglishLevel(newLevel);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>English Level</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={englishLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select your level" />
          </SelectTrigger>
          <SelectContent>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter className={"justify-end"}>
        <Button onClick={handleEnglishLevelChange}>Confirm</Button>
      </CardFooter>
    </Card>
  );
};
