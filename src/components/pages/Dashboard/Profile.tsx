import * as React from "react";
import { FormEvent } from "react";

import { useLoggedUser } from "meteor/quave:logged-user-react";
import { useSubscribe } from "meteor/react-meteor-data";

import { PlusCircle } from "lucide-react";

import { useMethodCaller } from "/imports/ui/utils";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { LoaderSpinner } from "~/components/ui/loader";

export function Profile() {
  const isLoadingProfile = useSubscribe("user.profile");
  const { loggedUser, isLoadingLoggedUser } = useLoggedUser();

  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (!name && loggedUser?.profile?.name) {
      setName(loggedUser.profile?.name);
    }
  }, [loggedUser]);

  const { callMethod } = useMethodCaller();

  const handleProfileUpdate = () => {
    callMethod(
      "users.updateProfile",
      {
        pending: () => "Saving settings...",
        success: () => "Settings updated successfully",
        error: () => "Error updating settings",
      },
      {
        name,
      },
    ).finally(() => {});
  };

  const [isAddEmailDialogOpen, setIsAddEmailDialogOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");

  const handleAddEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    callMethod(
      "users.addEmail",
      {
        pending: () => "Adding email...",
        success: () => "Email added successfully",
        error: () => "Error adding email",
      },
      {
        email: newEmail,
      },
    ).finally(() => setIsAddEmailDialogOpen(false));
  };

  const handleRemoveEmail = (email: string) => {
    callMethod(
      "users.removeEmail",
      {
        pending: () => "Removing email...",
        success: () => "Email removed successfully",
        error: () => "Error removing email",
      },
      {
        email,
      },
    ).finally(() => {});
  };

  const isLoading = isLoadingProfile() || isLoadingLoggedUser;

  return isLoading ? (
    <LoaderSpinner />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Profile Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={"w-80"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Emails</Label>
          {loggedUser?.emails.map((email) => (
            <span key={email.address} className="flex items-center">
              <Input
                id={email._id}
                type="email"
                value={email.address}
                className="ml-4 w-80"
                disabled
              />
              {loggedUser?.emails.length > 1 && (
                <button
                  className="h-10 p-2 flex items-center"
                  onClick={() => handleRemoveEmail(email.address)}
                >
                  <PlusCircle className="transform rotate-45" />
                </button>
              )}
            </span>
          ))}
          {loggedUser?.emails.length < 5 && (
            <Button
              variant={"ghost"}
              className="ml-4 h-10 p-2 flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                setIsAddEmailDialogOpen(true);
              }}
            >
              <PlusCircle /> Add Email
            </Button>
          )}

          <Dialog
            open={isAddEmailDialogOpen}
            onOpenChange={setIsAddEmailDialogOpen}
          >
            <DialogContent>
              <form onSubmit={handleAddEmail}>
                <DialogHeader>
                  <DialogTitle>Add Email Address</DialogTitle>
                </DialogHeader>
                <div className="my-5">
                  <Input
                    id="addEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button>Confirm</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <CardFooter className={"justify-end"}>
        <Button onClick={handleProfileUpdate}>Update Profile</Button>
      </CardFooter>
    </Card>
  );
}
