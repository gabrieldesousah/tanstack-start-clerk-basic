import React from "react";

import { toast } from "sonner";

import { Button } from "~/components/ui/button";

import { WordMeaningAndAlternative } from "./WordMeaningAndAlternative";
import { LoaderSpinner } from "~/components/ui/loader";
import { Loader2Icon } from "lucide-react";
import { AudioPlayer } from "~/components/pages/Videos/AudioPlayer";
import { createExplanation, findTextWithWord } from "~/utils/words";
import { createUserLearningWord } from "~/utils/user-learning-words";

type Dictionary = Awaited<ReturnType<typeof createExplanation>>;
type Caption = Awaited<ReturnType<typeof findTextWithWord>>[number];

const availableLanguages = ["en", "pt"] as const;

export const WordDialogContent = ({
  word,
  canSave = true,
}: {
  word: string;
  canSave?: boolean;
}) => {
  const [dictionary, setDictionary] = React.useState<Dictionary>();
  const [captions, setCaptions] = React.useState<Caption[]>([]);
  const [isLoadingDictionary, setIsLoadingDictionary] = React.useState(false);
  const [isLoadingPhrases, setIsLoadingPhrases] = React.useState(false);

  const isLoading = isLoadingPhrases || isLoadingDictionary;

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoadingDictionary(true);
      setIsLoadingPhrases(true);

      try {
        const result = await createExplanation({ data: word });
        setDictionary(result);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingDictionary(false);
      }

      try {
        const captionsResult = await findTextWithWord({ data: word });
        setCaptions(captionsResult);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingPhrases(false);
      }
    };

    fetchData();
  }, [word]);

  const handleSaveWord = async () => {
    if (!dictionary?.id) return;

    try {
      await createUserLearningWord({
        data: { wordId: dictionary.id },
      });
      toast("Word saved successfully", {
        description: "You can now study this word",
      });
    } catch (error) {
      toast("Error saving word", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
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
                    .map((caption) => (
                      <li key={caption.id}>
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
          {isLoading ? (
            <Button variant="secondary" disabled>
              Downloading
              <Loader2Icon data-icon="inline-start" />
            </Button>
          ) : (
            <Button type="button" variant="secondary" onClick={handleSaveWord}>
              Save to learn
            </Button>
          )}
        </div>
      )}
    </>
  );
};
