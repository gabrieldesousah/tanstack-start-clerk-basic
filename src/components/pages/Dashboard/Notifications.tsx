import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

export const Notifications = () => {
  const [notificationPreferences, setNotificationPreferences] = React.useState({
    whatsapp: {
      marketing: false,
      learningTips: false,
      discoveryWords: false,
    },
    email: {
      marketing: false,
      learningTips: false,
      discoveryWords: false,
    },
  });

  const handleNotificationUpdate = () => {
    // Implement notification preferences update logic here
    console.log("Updating notification preferences:", notificationPreferences);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">WhatsApp</h3>
          {Object.entries(notificationPreferences.whatsapp).map(
            ([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`whatsapp-${key}`}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      whatsapp: {
                        ...notificationPreferences.whatsapp,
                        [key]: checked,
                      },
                    })
                  }
                />
                <Label htmlFor={`whatsapp-${key}`}>
                  Allow receive {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </Label>
              </div>
            ),
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Email</h3>
          {Object.entries(notificationPreferences.email).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`email-${key}`}
                checked={value}
                onCheckedChange={(checked) =>
                  setNotificationPreferences({
                    ...notificationPreferences,
                    email: { ...notificationPreferences.email, [key]: checked },
                  })
                }
              />
              <Label htmlFor={`email-${key}`}>
                Allow receive {key.replace(/([A-Z])/g, " $1").toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className={"justify-end"}>
        <Button onClick={handleNotificationUpdate}>Update Preferences</Button>
      </CardFooter>
    </Card>
  );
};
