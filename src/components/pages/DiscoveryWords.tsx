import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getUnlearnedWords } from "~/utils/user-learning-words";

import { SelectCorrectOption } from "~/components/fragments/Challenges/SelectCorrectOption";
import { WordCard } from "~/components/fragments/Words/WordCard";
import { LoaderSpinner } from "~/components/ui/loader";

export const DiscoveryWords = () => {
  const [index, setIndex] = useState(0);

  const { data: unlearnedWords, isLoading } = useQuery({
    queryKey: ["unlearned-words"],
    queryFn: () => getUnlearnedWords(),
  });

  return (
    <div className="flex flex-col grow h-full p-5">
      {isLoading ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoaderSpinner />
        </div>
      ) : !unlearnedWords || unlearnedWords.length === 0 ? (
        <WordCard>No words to review</WordCard>
      ) : (
        <>
          <h2 className="text-2xl font-bold my-5">New words</h2>
          <div className="flex w-full justify-center">
            <SelectCorrectOption
              dictionaryWord={unlearnedWords[index]}
              setCompleted={() => setIndex(index + 1)}
            />
          </div>
        </>
      )}
    </div>
  );
};
