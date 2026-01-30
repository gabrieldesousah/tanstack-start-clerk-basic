import * as React from "react";

import {
  Bell,
  BookOpenCheck,
  GraduationCap,
  MessageSquare,
  User,
} from "lucide-react";

import { EnglishLevel } from "/imports/ui/Pages/Dashboard/EnglishLevel";
import { Notifications } from "/imports/ui/Pages/Dashboard/Notifications";
import { Profile } from "/imports/ui/Pages/Dashboard/Profile";
import { ReviewWords } from "/imports/ui/Pages/Dashboard/ReviewWords";
import { WhatsApp } from "/imports/ui/Pages/Dashboard/WhatsApp";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function ProfileDashboard() {
  const tabItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "level", label: "English Level", icon: GraduationCap },
    { id: "review_words", label: "Words bank", icon: BookOpenCheck },
  ];

  return (
    <div className="flex flex-col h-screen md:flex-row p-5">
      <Tabs
        defaultValue="profile"
        className="w-full flex flex-col md:flex-row gap-2"
        orientation="vertical"
      >
        <TabsList className="flex md:flex-col h-auto md:w-1/4 justify-start p-2">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="w-full justify-center md:justify-start"
            >
              <tab.icon className="mr-2 h-4 w-4" />
              <span className="hidden md:block">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className={"w-full"}>
          <Profile />
        </TabsContent>
        <TabsContent value="whatsapp" className={"w-full"}>
          <WhatsApp />
        </TabsContent>
        <TabsContent value="notifications" className={"w-full"}>
          <Notifications />
        </TabsContent>
        <TabsContent value="level" className={"w-full"}>
          <EnglishLevel />
        </TabsContent>
        <TabsContent value="review_words" className={"w-full"}>
          <ReviewWords />
        </TabsContent>
      </Tabs>
    </div>
  );
}
