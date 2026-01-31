import { useSearch, useNavigate } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { searchVideos } from "~/utils/videos";

import { VideoCard } from "./Videos/VideoCard";
import { useEffect, useState, SubmitEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { searchYoutubeVideos } from "~/utils/youtube";
import { useQuery } from "@tanstack/react-query";

export const ListYoutubeVideos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("Bruno Mars");

  const getYoutubeVideos = useServerFn(searchYoutubeVideos);

  const { data: videos } = useQuery({
    queryKey: ["youtube-videos"],
    queryFn: () => getYoutubeVideos({ data: search }),
  });

  const handleSearchVideos = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;

    setIsLoading(true);
    // navigate({ search: { search } });

    try {
      const result = await searchVideos({ data: search });
      // setVideos(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
      <form
        className="flex w-full gap-x-2 lg:col-span-2"
        onSubmit={handleSearchVideos}
      >
        <Input
          type="text"
          className="w-full"
          name="search"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          placeholder="Search for videos"
        />
        <Button type="submit" isLoading={isLoading}>
          Search Videos
        </Button>
      </form>
      {videos.map((video) => (
        <VideoCard key={video.externalId} video={video} />
      ))}
    </div>
  );
};
