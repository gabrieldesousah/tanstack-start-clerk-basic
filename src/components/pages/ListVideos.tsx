import * as React from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { searchVideos } from "~/utils/videos";

import { VideoCard } from "./Videos/VideoCard";

export const ListVideos = () => {
  const { search: searchQuery } = useSearch({ strict: false });
  const navigate = useNavigate();
  const [search, setSearch] = React.useState(searchQuery ?? "");
  const [videos, setVideos] = React.useState<
    Awaited<ReturnType<typeof searchVideos>>
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      searchVideos({ data: searchQuery })
        .then((result) => {
          setVideos(result);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [searchQuery]);

  const handleSearchVideos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;

    setIsLoading(true);
    navigate({ search: { search } });

    try {
      const result = await searchVideos({ data: search });
      setVideos(result);
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
