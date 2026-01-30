import * as React from "react";
import { useSearchParams } from "react-router-dom";

import { Meteor } from "meteor/meteor";

import { Video } from "/imports/api/videos/collections";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { VideoCard } from "./Videos/VideoCard";

export const ListVideos = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const [search, setSearch] = React.useState(searchQuery);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (searchQuery) {
      setIsLoading(true);
      Meteor.call(
        "youtube.search",
        searchQuery,
        (error: Error, result: Video[]) => {
          if (error) {
            console.error(error);
          } else {
            setVideos(result);
          }
          setIsLoading(false);
        },
      );
    }
  }, []);

  const searchVideos = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (search) {
      setSearchParams({ search });
      Meteor.call("youtube.search", search, (error: Error, result: Video[]) => {
        if (error) {
          console.error(error);
        } else {
          setVideos(result);
        }
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
      <form
        className="flex w-full gap-x-2 lg:col-span-2"
        onSubmit={searchVideos}
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
      {videos.map((video: Video) => (
        <VideoCard key={video.externalId} video={video} />
      ))}
    </div>
  );
};
