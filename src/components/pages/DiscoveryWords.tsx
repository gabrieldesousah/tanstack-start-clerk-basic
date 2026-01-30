import React, { useState } from "react";

import { useFind, useSubscribe } from "meteor/react-meteor-data";

import { DictionaryCollection } from "/imports/api/words/collections";

import { SelectCorrectOption } from "~/components/Challenges/SelectCorrectOption";
import { WordCard } from "~/components/Words/WordCard";
import { LoaderSpinner } from "~/components/ui/loader";

/**
 * Get words that isn't in user-dictionary but in the same user level
 */
export const DiscoveryWords = () => {
  const [index, setIndex] = useState(0);

  const isLoading = useSubscribe("unlearnedWords");

  const unlearnedWords = useFind(() => DictionaryCollection.find({}));

  console.log("unlearnedWords", unlearnedWords);

  return (
    <div className="flex flex-col flex-grow h-full p-5">
      {isLoading() ? (
        <div className="flex justify-center items-center h-full w-full">
          <LoaderSpinner />
        </div>
      ) : unlearnedWords.length === 0 ? (
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
