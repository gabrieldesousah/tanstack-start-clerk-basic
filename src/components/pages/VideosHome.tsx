import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";

import { getVideos } from "~/utils/videos";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { LoaderSpinner } from "~/components/ui/loader";

import { VideoCard } from "./Videos/VideoCard";

export const VideosHome = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos", searchQuery],
    queryFn: () => getVideos({ data: searchQuery || undefined }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(search);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const searchVideosOnYoutube = () => {
    navigate({ to: "/youtube", search: { search: searchQuery } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <form
        className="flex w-full gap-x-2 lg:col-span-2"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          className="w-full"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search for videos"
        />
        <Button type="submit">Search Videos</Button>
      </form>
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
      {search && (
        <div className="flex w-full justify-center gap-x-2 lg:col-span-2">
          <Button onClick={searchVideosOnYoutube}>Search on Youtube</Button>
        </div>
      )}
    </div>
  );
};
