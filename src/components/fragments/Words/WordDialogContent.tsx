import React from "react";

import { Meteor } from "meteor/meteor";
import { useFind, useSubscribe } from "meteor/react-meteor-data";

import {
  type Caption,
  CaptionsCollection,
} from "/imports/api/captions/collections";
import {
  type Dictionary,
  availableLanguages,
} from "/imports/api/words/collections";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";

import { WordMeaningAndAlternative } from "./WordMeaningAndAlternative";
import { LoaderSpinner } from "~/components/ui/loader";
import { Loader2Icon } from "lucide-react";
import { AudioPlayer } from "~/components/pages/Videos/AudioPlayer";

export const WordDialogContent = ({
  word,
  canSave = true,
}: {
  word: string;
  canSave?: boolean;
}) => {
  const [dictionary, setDictionary] = React.useState<Dictionary>();
  const [isLoadingDictionary, setIsLoadingDictionary] = React.useState(false);

  const isLoadingPhrases = useSubscribe("captions.findByWord", { word });
  const captions = useFind(() =>
    CaptionsCollection.find(
      {
        text: { $regex: word },
      },
      { limit: 10 },
    ),
  );

  const isLoading = isLoadingPhrases() || isLoadingDictionary;

  const fetchDictionary = () => {
    setIsLoadingDictionary(true);

    Meteor.call(
      "words.explanation",
      word,
      (error: Error, result: Dictionary) => {
        setIsLoadingDictionary(false);

        if (error || !result) {
          console.error(error);
          return;
        }
        setDictionary(result);
      },
    );
  };

  React.useEffect(() => {
    fetchDictionary();
  }, [word]);

  const handleSaveWord = () => {
    Meteor.call(
      "user-learning.words.add",
      { wordId: dictionary?._id },
      (error: Error) => {
        if (error) {
          toast("Error saving word", {
            description: error.message,
          });
        } else {
          toast("Word saved successfully", {
            description: "You can now study this word",
          });
        }
      },
    );
  };

  return (
    <>
      <div>
        {isLoading ? (
          <LoaderSpinner />
        ) : (
          <>
            {dictionary && (
              <div className="grid grid-cols-2 gap-4">
                {availableLanguages.map((lang) => (
                  <WordMeaningAndAlternative
                    key={lang}
                    dictionaryWord={dictionary}
                    lang={lang}
                  />
                ))}
              </div>
            )}
            {captions.length > 0 && (
              <>
                <hr className="my-2" />
                <b className="">Examples with this word:</b>
                <ul className="list-inside list-disc">
                  {captions
                    .filter(
                      (caption, index, self) =>
                        index ===
                        self.findIndex((c) => c.text === caption.text),
                    )
                    .map((caption: Caption) => (
                      <li key={caption._id}>
                        {caption.text
                          .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
                          .split(" ")
                          .map((captionWord, index) =>
                            captionWord.toLowerCase() === word.toLowerCase() ? (
                              <strong key={index}>{captionWord} </strong>
                            ) : (
                              <span key={index}>{captionWord} </span>
                            ),
                          )}

                        <AudioPlayer
                          videoId={caption.videoId || ""}
                          start={caption.start}
                          end={caption.start + caption.dur}
                        />
                      </li>
                    ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>

      {canSave && (
        <div className="flex justify-end">
          isLoading ? (
          <Button variant="secondary" disabled>
            Downloading
            <Loader2Icon data-icon="inline-start" />
          </Button>
          ) : (
          <Button type="button" variant="secondary" onClick={handleSaveWord}>
            Save to learn
          </Button>
          )
        </div>
      )}
    </>
  );
};
