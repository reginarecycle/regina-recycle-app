import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Users,
  Volume2,
  Truck,
  AlertTriangle,
  Eye,
  EyeClosed,
  MapPin,
} from "lucide-react";

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="p-6 md:p-8">
      <Card className="p-0 bg-white">
        {/* Profile Header */}
        <div className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-green-100">
              <AvatarImage src="/avatar.png" alt="John Doe" />
              <AvatarFallback className="bg-green-100 text-green-600 text-3xl font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">John Doe</h1>

                <Badge
                  variant="success"
                  className="flex w-[106px] px-2 py-0 flex-col items-center rounded-[34px] border border-green-800 bg-green-100"
                >
                  VERIFIED USER
                </Badge>
              </div>

              <p className="text-muted-foreground text-base">
                Member since January 2026
              </p>
            </div>

          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="details" className="w-full">
          <div className="px-8 pt-6">
            <TabsList>
              <TabsTrigger value="details">My Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </div>

          {/* My Details Tab */}
          <TabsContent value="details" className="mt-0 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">
                Personal Information
              </h2>
              <p className="text-sm text-muted-foreground">
                Update your account information and contact details
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-sm font-medium">Full name</Label>
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    defaultValue="John Doe"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doe@gmail.com"
                    defaultValue="doe@gmail.com"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="1-(306)-0000"
                    defaultValue="1-(306)-0000"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                  <div className="relative">
                    <Input
                      id="dob"
                      type="text"
                      placeholder="DD-MM-YYYY"
                      defaultValue="DD-MM-YYYY"
                      className="h-11"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="123 Lane Str."
                    defaultValue="123 Lane Str."
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  className="w-[174px] h-11 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                  disabled
                >
                  Cancel
                </Button>
                <Button
                  className="w-[174px] h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:border-primary"
                  disabled
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-0 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">
                Password Management
              </h2>
              <p className="text-sm text-muted-foreground">
                Secure your account by updating your password regularly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <EyeClosed className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  className="w-[174px] h-11 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                  disabled
                >
                  Cancel
                </Button>
                <Button
                  className="w-[174px] h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:border-primary"
                  disabled
                >
                  Update Password
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Delete Account */}
            <div className="flex justify-center items-center w-full max-w-[1078px] p-9 rounded-[14px] border border-red-600 bg-[rgba(221,30,30,0.06)] backdrop-blur-[20px] shrink-0">
              <div className="flex items-start justify-between gap-4 w-full">
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-600/80">
                    Once you delete your account, there is no going back. Please be certain .
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-[171px] h-[52px] bg-white text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-0 p-8">
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <div className="flex items-start justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Email Notification
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via your registered email
                      address.
                    </p>
                  </div>
                  <Button
                    className="w-[174px] h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:border-primary"
                    disabled
                  >
                    Update Preferences
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Clock className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Pickup Reminders</h3>
                        <p className="text-sm text-muted-foreground">
                          Get notified 24 hours before your scheduled collection.
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked className="shrink-0" />
                  </div>

                  <div className="flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Users className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Account Activity</h3>
                        <p className="text-sm text-muted-foreground">
                          Security alert, password changes and login
                          notifications.
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked className="shrink-0" />
                  </div>

                  <div className="flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Volume2 className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Marketing</h3>
                        <p className="text-sm text-muted-foreground">
                          Newsletter, impact reports, promotional offers
                        </p>
                      </div>
                    </div>
                    <Switch className="shrink-0" />
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* In-App Notifications */}
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-1">
                    In-App Notification
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Get instant update within the platform
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Truck className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Pickup Reminders</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive a text message 1 hour before pickup.
                        </p>
                      </div>
                    </div>
                    <Switch className="shrink-0" />
                  </div>

                  <div className="flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                      <div>
                        <h3 className="font-medium mb-1">Important Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                          Service disruption, weather delays, and urgent updates.
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked className="shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}