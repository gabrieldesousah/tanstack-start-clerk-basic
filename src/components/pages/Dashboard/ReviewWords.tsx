import { useQuery } from "@tanstack/react-query";

import { getUserLearningWords } from "~/utils/user-learning-words";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LoaderSpinner } from "~/components/ui/loader";
import { columns } from "~/components/fragments/Words/LearningWordsTable/Columns";
import { DataTable } from "~/components/fragments/Words/LearningWordsTable/DataTable";

export const ReviewWords = () => {
  const { data: userLearningWords, isLoading } = useQuery({
    queryKey: ["user-learning-words"],
    queryFn: () => getUserLearningWords(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Words</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-full w-full">
            <LoaderSpinner />
          </div>
        ) : !userLearningWords || userLearningWords.length === 0 ? (
          <>No words to review</>
        ) : (
          <>
            <h2 className="text-2xl font-bold my-5">Your dictionary</h2>
            <DataTable data={userLearningWords} columns={columns} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
