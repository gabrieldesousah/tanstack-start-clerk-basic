import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";

export const WhatsApp = () => {
  const [whatsappData, setWhatsappData] = React.useState({
    phoneNumber: "",
    otpCode: "",
  });

  const handleWhatsAppUpdate = () => {
    // Implement WhatsApp number update logic here
    console.log("Updating WhatsApp number:", whatsappData.phoneNumber);
  };

  const [otp, setOtp] = React.useState("");
  const handleOTPConfirmation = () => {
    // Implement OTP confirmation logic here
    console.log("Confirming OTP:", otp);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={whatsappData.phoneNumber}
            onChange={(e) =>
              setWhatsappData({
                ...whatsappData,
                phoneNumber: e.target.value,
              })
            }
          />
        </div>
        <Button onClick={handleWhatsAppUpdate}>Update Phone Number</Button>
        <div className="space-y-2">
          <Label htmlFor="otpCode">OTP Code</Label>
          <InputOTP maxLength={6} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot className={"bg-background"} index={0} />
              <InputOTPSlot className={"bg-background"} index={1} />
              <InputOTPSlot className={"bg-background"} index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot className={"bg-background"} index={3} />
              <InputOTPSlot className={"bg-background"} index={4} />
              <InputOTPSlot className={"bg-background"} index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </CardContent>
      <CardFooter className={"justify-end"}>
        <Button onClick={handleOTPConfirmation}>Confirm OTP</Button>
      </CardFooter>
    </Card>
  );
};
