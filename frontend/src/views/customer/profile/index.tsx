// src/pages/ProfilePage.tsx
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import NotificationSection from "@/components/ui/notificationSection";
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
  // Password & UI toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // form changed states
  const [detailsChanged, setDetailsChanged] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // notifications state (controlled switches)
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    // email
    "email:pickup": true,
    "email:activity": true,
    "email:marketing": false,
    // in-app
    "inapp:pickup": false,
    "inapp:alerts": true,
  });
  const [notificationsChanged, setNotificationsChanged] = useState(false);

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  // Helpers for notifications
  const handleToggle = (id: string, checked: boolean) => {
    setNotificationPrefs((prev) => ({ ...prev, [id]: checked }));
    setNotificationsChanged(true);
  };

  const handleSaveEmail = () => {
    // TODO: call API to persist email notification prefs
    // on success:
    setNotificationsChanged(false);
  };

  // row data derived from state (keeps UI controlled)
  const emailRows = [
    {
      id: "email:pickup",
      icon: <Clock className="h-6 w-6 text-gray-600" />,
      title: "Pickup Reminders",
      description: "Get notified 24 hours before your scheduled collection.",
      checked: !!notificationPrefs["email:pickup"],
    },
    {
      id: "email:activity",
      icon: <Users className="h-6 w-6 text-gray-600" />,
      title: "Account Activity",
      description: "Security alert, password changes and login notifications.",
      checked: !!notificationPrefs["email:activity"],
    },
    {
      id: "email:marketing",
      icon: <Volume2 className="h-6 w-6 text-gray-600" />,
      title: "Marketing",
      description: "Newsletter, impact reports, promotional offers",
      checked: !!notificationPrefs["email:marketing"],
    },
  ];

  const inAppRows = [
    {
      id: "inapp:pickup",
      icon: <Truck className="h-6 w-6 text-gray-600" />,
      title: "Pickup Reminders",
      description: "Receive a text message 1 hour before pickup.",
      checked: !!notificationPrefs["inapp:pickup"],
    },
    {
      id: "inapp:alerts",
      icon: <AlertTriangle className="h-6 w-6 text-gray-600" />,
      title: "Important Alerts",
      description: "Service disruption, weather delays, and urgent updates.",
      checked: !!notificationPrefs["inapp:alerts"],
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <Card className="p-0 bg-white">
        {/* Profile Header */}
        <div className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-green-100">
              <AvatarImage src="/avatar.png" alt="John Doe" />
              <AvatarFallback className="bg-green-100 text-green-600 text-3xl font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-4xl font-bold">John Doe</h1>
                <Badge
                  variant="success"
                  className="flex px-2 py-1 items-center rounded-[34px] border border-green-800 bg-green-100 text-[10px] sm:text-xs whitespace-nowrap"
                >
                  VERIFIED CUSTOMER
                </Badge>
              </div>
              <p className="text-muted-foreground text-base">
                Member since January 2026
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <div className="px-8 pt-6">
            <TabsList>
              <TabsTrigger value="details">My Details</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
          </div>

          {/* My Details */}
          <TabsContent value="details" className="mt-0 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Update your account information and contact details
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-sm font-medium">
                    Full name
                  </Label>
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    defaultValue="John Doe"
                    className="h-11"
                    onChange={() => setDetailsChanged(true)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="doe@gmail.com"
                    defaultValue="doe@gmail.com"
                    className="h-11"
                    onChange={() => setDetailsChanged(true)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="1-(306)-0000"
                    defaultValue="1-(306)-0000"
                    className="h-11"
                    onChange={() => setDetailsChanged(true)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-medium">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Input
                      id="dob"
                      type="text"
                      placeholder="DD-MM-YYYY"
                      defaultValue="DD-MM-YYYY"
                      className="h-11"
                      onChange={() => setDetailsChanged(true)}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="123 Lane Str."
                    defaultValue="123 Lane Str."
                    className="pl-10 h-11"
                    onChange={() => setDetailsChanged(true)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button
                  variant="outline"
                  className="w-[174px] h-11 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                  disabled={!detailsChanged}
                  onClick={() => setDetailsChanged(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="w-[174px] h-11 bg-primary hover:bg-primary/90 disabled:opacity-60"
                  disabled={!detailsChanged}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-0 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Password Management</h2>
              <p className="text-sm text-muted-foreground">
                Secure your account by updating your password regularly.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    className="h-11 pr-10"
                    onChange={() => setPasswordChanged(true)}
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
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-11 pr-10"
                      onChange={() => setPasswordChanged(true)}
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
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="h-11 pr-10"
                      onChange={() => setPasswordChanged(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  disabled={!passwordChanged}
                  onClick={() => setPasswordChanged(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="w-[174px] h-11 bg-primary hover:bg-primary/90 disabled:opacity-60"
                  disabled={!passwordChanged}
                >
                  Update Password
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Delete Account card */}
            <div className="relative flex justify-center items-center w-full max-w-[1078px] p-9 rounded-[14px] border border-red-600 bg-[rgba(221,30,30,0.06)] backdrop-blur-[20px] shrink-0">
              {/* decorative image: change src if needed */}
              <img
                src="/delete-account.png"
                alt="Delete Account Decor"
                aria-hidden="true"
                className="absolute -top-18 -right-30 w-74 sm:w-50 opacity-40 pointer-events-none select-none"
              />

              <div className="flex items-start justify-between gap-4 w-full">
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-600/80">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-[171px] h-[52px] bg-white text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-0 p-8">
            <div className="space-y-6">
              {/* Email Notifications section (has save button) */}
              <NotificationSection
                title="Email Notification"
                subtitle="Receive updates and alerts via your registered email address."
                rows={emailRows}
                onToggle={handleToggle}
                onSave={handleSaveEmail}
                saveLabel="Update Preferences"
                saveDisabled={!notificationsChanged}
              />

              <Separator className="my-8" />

              {/* In-App Notifications section (no save button) */}
              <NotificationSection
                title="In-App Notification"
                subtitle="Get instant update within the platform"
                rows={inAppRows}
                onToggle={handleToggle}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[90vw] sm:max-w-[562px] p-6 sm:p-8 [&>button]:hidden mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-100 mb-4 sm:mb-6">
              <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Delete Account</h2>

            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              This action is permanent and cannot be undone. All your data, rewards, and history will be lost. To confirm, please type <span className="font-semibold text-foreground">"DELETE"</span> in the box below.
            </p>

            <Input
              placeholder='Type "DELETE" to confirm'
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              className="h-11 sm:h-12 text-center mb-4 sm:mb-6 w-full"
            />

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteText("");
                  setDeleteDialogOpen(false);
                }}
                className="w-full sm:w-[240px] h-[52px] border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                disabled={deleteText !== "DELETE"}
                className="w-full sm:w-[240px] h-[52px] bg-red-600 hover:bg-red-700 text-white disabled:bg-[rgba(221,30,30,0.60)]"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}