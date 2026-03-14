import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import InputField from "@/components/forms/input-field";
import {
  profileDetailsSchema,
  changePasswordSchema,
  type ProfileDetailsFormValues,
  type ChangePasswordFormValues,
} from "@/lib/validation";
import {
  Calendar,
  Clock,
  Users,
  Volume2,
  Truck,
  AlertTriangle,
  MapPin,
} from "lucide-react";

export default function ProfilePage() {
  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: detailsErrors, isDirty: detailsIsDirty },
    reset: resetDetails,
  } = useForm<ProfileDetailsFormValues>({
    resolver: zodResolver(profileDetailsSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "John Doe",
      email: "doe@gmail.com",
      phone: "1-(306)-0000",
      dateOfBirth: "DD-MM-YYYY",
      address: "123 Lane Str.",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isDirty: passwordIsDirty },
    reset: resetPassword,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  // notifications state
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    "email:pickup": true,
    "email:activity": true,
    "email:marketing": false,
    "inapp:pickup": false,
    "inapp:alerts": true,
  });
  const [notificationsChanged, setNotificationsChanged] = useState(false);

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  // Form submit handlers
  const onSubmitDetails = (data: ProfileDetailsFormValues) => {
    console.log("Profile details:", data);
    // TODO: Call API to update profile
  };

  const onSubmitPassword = (data: ChangePasswordFormValues) => {
    console.log("Password change:", data);
    // TODO: Call API to change password
    resetPassword();
  };

  const handleToggle = (id: string) => {
    setNotificationPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setNotificationsChanged(true);
  };

  const handleSaveEmail = () => {
    // TODO: call API to persist email notification prefs
    setNotificationsChanged(false);
  };

  return (
    <div className="p-6 md:p-8">
      <Card className="p-0 bg-white border-0">
        {/* Profile Header */}
        <div className="p-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-32 sm:w-32 border-4 border-green-100 shrink-0">
              <AvatarImage src="/avatar.png" alt="John Doe" />
              <AvatarFallback className="bg-green-100 text-green-600 text-2xl sm:text-3xl font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-4xl font-bold mb-2">John Doe</h1>
              <Badge
                variant="success"
                className="inline-flex px-2 py-1 items-center rounded-[34px] border border-green-800 bg-green-100 text-[10px] sm:text-xs whitespace-nowrap mb-2"
              >
                VERIFIED CUSTOMER
              </Badge>
              <p className="text-muted-foreground text-sm sm:text-base">
                Member since January 2026
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <div className="px-6 pb-0 border-b overflow-x-auto">
            <TabsList className="w-full sm:w-auto inline-flex h-auto bg-transparent p-0">
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

            <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full name"
                  register={registerDetails("fullName")}
                  error={detailsErrors.fullName?.message}
                  placeholder="John Doe"
                  required
                />
                <InputField
                  label="Email"
                  register={registerDetails("email")}
                  error={detailsErrors.email?.message}
                  type="email"
                  placeholder="doe@gmail.com"
                  disabled
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number"
                  register={registerDetails("phone")}
                  error={detailsErrors.phone?.message}
                  placeholder="1-(306)-0000"
                  required
                />
                <div className="relative">
                  <InputField
                    label="Date of Birth"
                    register={registerDetails("dateOfBirth")}
                    error={detailsErrors.dateOfBirth?.message}
                    placeholder="DD-MM-YYYY"
                    required
                  />
                  <Calendar className="absolute right-3 top-[32px] h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-[32px] h-5 w-5 text-muted-foreground pointer-events-none" />
                <InputField
                  label="Address"
                  register={registerDetails("address")}
                  error={detailsErrors.address?.message}
                  placeholder="123 Lane Str."
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                  disabled={!detailsIsDirty}
                  onClick={() => resetDetails()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
                  disabled={!detailsIsDirty}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-0 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-1">Password Management</h2>
              <p className="text-sm text-muted-foreground">
                Secure your account by updating your password regularly.
              </p>
            </div>

            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              <InputField
                label="Current Password"
                register={registerPassword("currentPassword")}
                error={passwordErrors.currentPassword?.message}
                type="password"
                placeholder="Enter current password"
                showPasswordToggle
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="New Password"
                  register={registerPassword("newPassword")}
                  error={passwordErrors.newPassword?.message}
                  type="password"
                  placeholder="Enter new password"
                  showPasswordToggle
                  required
                />
                <InputField
                  label="Confirm Password"
                  register={registerPassword("confirmPassword")}
                  error={passwordErrors.confirmPassword?.message}
                  type="password"
                  placeholder="Confirm new password"
                  showPasswordToggle
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                  disabled={!passwordIsDirty}
                  onClick={() => resetPassword()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
                  disabled={!passwordIsDirty}
                >
                  Update Password
                </Button>
              </div>
            </form>

            <Separator className="my-8" />

            {/* Delete Account */}
            <div className="relative flex flex-col sm:flex-row justify-center items-center w-full max-w-[1078px] p-6 sm:p-9 rounded-[14px] border border-red-600 bg-[rgba(221,30,30,0.06)] backdrop-blur-[20px] shrink-0">
              <img
                src="/delete-account.png"
                alt="Delete Account Decor"
                aria-hidden="true"
                className="absolute -top-18 -right-30 w-74 sm:w-50 opacity-40 pointer-events-none select-none hidden sm:block"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-600/80">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full sm:w-[171px] h-[52px] min-w-0 bg-white text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 shrink-0"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-0 p-8">
            <div className="space-y-8">
              {/* Email Notification Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Email Notification</h2>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts via your registered email address.
                    </p>
                  </div>
                  <Button
                    className="w-full sm:w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
                    onClick={handleSaveEmail}
                    disabled={!notificationsChanged}
                  >
                    Update Preferences
                  </Button>
                </div>

                {/* Email Notification Rows */}
                <div className="space-y-3">
                  <div className="px-4 py-3 rounded-xl bg-[#F7F7F7] flex items-center gap-3">
                    <div className="w-[45px] h-[45px] p-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-0.5">Pickup Reminders</h3>
                      <p className="text-xs text-muted-foreground">
                        Get notified 24 hours before your scheduled collection.
                      </p>
                    </div>
                    <Switch
                      className="shrink-0"
                      checked={notificationPrefs["email:pickup"]}
                      onCheckedChange={() => handleToggle("email:pickup")}
                    />
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-[#F7F7F7] flex items-center gap-3">
                    <div className="w-[45px] h-[45px] p-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-0.5">Account Activity</h3>
                      <p className="text-xs text-muted-foreground">
                        Security alert, password changes and login notifications.
                      </p>
                    </div>
                    <Switch
                      className="shrink-0"
                      checked={notificationPrefs["email:activity"]}
                      onCheckedChange={() => handleToggle("email:activity")}
                    />
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-[#F7F7F7] flex items-center gap-3">
                    <div className="w-[45px] h-[45px] p-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-0.5">Marketing</h3>
                      <p className="text-xs text-muted-foreground">
                        Newsletter, impact reports, promotional offers
                      </p>
                    </div>
                    <Switch
                      className="shrink-0"
                      checked={notificationPrefs["email:marketing"]}
                      onCheckedChange={() => handleToggle("email:marketing")}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* In-App Notification Section */}
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-1">In-App Notification</h2>
                  <p className="text-sm text-muted-foreground">
                    Get instant update within the platform
                  </p>
                </div>

                {/* In-App Notification Rows */}
                <div className="space-y-3">
                  <div className="px-4 py-3 rounded-xl bg-[#F7F7F7] flex items-center gap-3">
                    <div className="w-[45px] h-[45px] p-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-0.5">Pickup Reminders</h3>
                      <p className="text-xs text-muted-foreground">
                        Receive a text message 1 hour before pickup.
                      </p>
                    </div>
                    <Switch
                      className="shrink-0"
                      checked={notificationPrefs["inapp:pickup"]}
                      onCheckedChange={() => handleToggle("inapp:pickup")}
                    />
                  </div>

                  <div className="px-4 py-3 rounded-xl bg-[#F7F7F7] flex items-center gap-3">
                    <div className="w-[45px] h-[45px] p-2.5 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-0.5">Important Alerts</h3>
                      <p className="text-xs text-muted-foreground">
                        Service disruption, weather delays, and urgent updates.
                      </p>
                    </div>
                    <Switch
                      className="shrink-0"
                      checked={notificationPrefs["inapp:alerts"]}
                      onCheckedChange={() => handleToggle("inapp:alerts")}
                    />
                  </div>
                </div>
              </div>
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

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteText("");
                  setDeleteDialogOpen(false);
                }}
                className="w-full sm:w-[240px] h-[52px] min-w-0 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                disabled={deleteText !== "DELETE"}
                className="w-full sm:w-[240px] h-[52px] min-w-0 bg-red-600 hover:bg-red-700 text-white disabled:bg-[rgba(221,30,30,0.60)]"
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