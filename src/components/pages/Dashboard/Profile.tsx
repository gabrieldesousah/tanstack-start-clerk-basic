import { SyntheticEvent, useEffect, useState } from "react";

import { useUser } from "@clerk/tanstack-start";

import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

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
  const { user, isLoaded } = useUser();

  const [name, setName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!name && user?.firstName) {
      setName(user.firstName + (user.lastName ? ` ${user.lastName}` : ""));
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    setIsUpdating(true);
    const toastId = toast.loading("Saving settings...");

    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await user.update({
        firstName,
        lastName,
      });

      toast.success("Settings updated successfully", { id: toastId });
    } catch (error) {
      toast.error("Error updating settings", { id: toastId });
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const [isAddEmailDialogOpen, setIsAddEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const handleAddEmail = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const toastId = toast.loading("Adding email...");

    try {
      await user.createEmailAddress({ email: newEmail });
      toast.success("Email added successfully. Please verify it.", {
        id: toastId,
      });
      setNewEmail("");
      setIsAddEmailDialogOpen(false);
    } catch (error) {
      toast.error("Error adding email", { id: toastId });
      console.error(error);
    }
  };

  const handleRemoveEmail = async (emailId: string) => {
    if (!user) return;

    const toastId = toast.loading("Removing email...");

    try {
      const emailAddress = user.emailAddresses.find((e) => e.id === emailId);
      if (emailAddress) {
        await emailAddress.destroy();
        toast.success("Email removed successfully", { id: toastId });
      }
    } catch (error) {
      toast.error("Error removing email", { id: toastId });
      console.error(error);
    }
  };

  const isLoading = !isLoaded;

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
          {user?.emailAddresses.map((email) => (
            <span key={email.id} className="flex items-center">
              <Input
                id={email.id}
                type="email"
                value={email.emailAddress}
                className="ml-4 w-80"
                disabled
              />
              {user.emailAddresses.length > 1 && (
                <button
                  className="h-10 p-2 flex items-center"
                  onClick={() => handleRemoveEmail(email.id)}
                >
                  <PlusCircle className="transform rotate-45" />
                </button>
              )}
            </span>
          ))}
          {(user?.emailAddresses.length ?? 0) < 5 && (
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
        <Button onClick={handleProfileUpdate} disabled={isUpdating}>
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
