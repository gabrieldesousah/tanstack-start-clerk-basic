import * as React from "react";

import { Dictionary } from "/imports/api/words/collections";

import { cn } from "~/lib/utils";

import { WordDialogExplanation } from "./WordDialogExplanation";

export const WordMeaningAndAlternative = ({
  dictionaryWord,
  lang,
  className,
  onClick,
}: {
  dictionaryWord: Dictionary;
  lang: "en" | "pt";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  // render words by phrase
  const renderWords = (text: string, lang?: string) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
      .split(/\s+/)
      .map((word, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && " "}
          {lang === "en" ? <WordDialogExplanation word={word} /> : word}
        </React.Fragment>
      ));
  };

  return (
    <div key={lang} className={cn("space-y-2", className)} onClick={onClick}>
      {dictionaryWord?.[lang]?.meanings && (
        <div>
          <h2 className="mb-2 text-2xl font-semibold capitalize">
            {dictionaryWord[lang]?.text || "No text available"}
          </h2>
          <h3 className="font-semibold capitalize">
            {lang === "en" ? "🇺🇸 English" : "🇧🇷 Português"}
          </h3>
          <h4 className="font-medium underline">Meanings:</h4>
          <ul className="list-disc pl-5">
            {dictionaryWord[lang]?.meanings?.map(
              (meaning: string, index: number) => (
                <li key={index} className="list-item break-words">
                  {renderWords(meaning, lang)}
                </li>
              ),
            )}
          </ul>
        </div>
      )}
      {dictionaryWord?.[lang]?.synonyms && (
        <div>
          <h4 className="font-medium underline">Synonyms:</h4>
          <ul className="list-disc pl-5">
            {dictionaryWord[lang]?.synonyms?.map(
              (alternative: string, index: number) => (
                <li key={index} className="list-item break-words">
                  {renderWords(alternative, lang)}
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
