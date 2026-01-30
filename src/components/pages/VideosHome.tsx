import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useFind, useSubscribe } from "meteor/react-meteor-data";

import { Video, VideosCollection } from "/imports/api/videos/collections";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { LoaderSpinner } from "~/components/ui/loader";

import { VideoCard } from "./Videos/VideoCard";

export const VideosHome = () => {
  const [search, setSearch] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const isLoading = useSubscribe("videos.list", searchQuery);
  console.log("search", search);
  const videos: Video[] = useFind(
    () =>
      VideosCollection.find(
        searchQuery ? { name: { $regex: searchQuery, $options: "i" } } : {},
      ),
    [],
  );

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
    navigate(`/videos?search=${searchQuery}`);
  };

  if (isLoading()) {
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
      {videos.map((video: Video) => (
        <VideoCard key={video._id} video={video} />
      ))}
      {search && (
        <div className="flex w-full justify-center gap-x-2 lg:col-span-2">
          <Button onClick={searchVideosOnYoutube}>Search on Youtube</Button>
        </div>
      )}
    </div>
  );
};
