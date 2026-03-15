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
import DataTable, { type Column } from "@/components/ui/data-table";
import {
    Clock,
    Users,
    DollarSign,
    Truck,
    AlertTriangle,
    MapPin,
} from "lucide-react";
import {
    collectorProfileSchema,
    collectorSecuritySchema,
    type CollectorProfileFormValues,
    type CollectorSecurityFormValues,
} from "@/lib/validation";

// Material type definition
type Material = {
    id: number;
    name: string;
    desc: string;
    basePrice: number;
    bulkRate: number;
    active: boolean;
    icon: string;
};

export default function CollectorSettingsPage() {
    const [currentTab, setCurrentTab] = useState("profile");
    const [currentPage, setCurrentPage] = useState(1);

    // Profile form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors, isDirty: profileIsDirty },
        reset: resetProfile,
    } = useForm<CollectorProfileFormValues>({
        resolver: zodResolver(collectorProfileSchema),
        mode: "onChange",
        defaultValues: {
            businessName: "Shahnaz and Sons Recycling",
            businessEmail: "ssr@gmail.com",
            businessPhone: "1-(306)-0000",
            registrationNumber: "123456789",
            address: "123 Lane Str.",
            city: "",
            provinceState: "",
            postalCode: "",
        },
    });

    // Security form
    const {
        register: registerSecurity,
        handleSubmit: handleSubmitSecurity,
        formState: { errors: securityErrors, isDirty: securityIsDirty },
        reset: resetSecurity,
    } = useForm<CollectorSecurityFormValues>({
        resolver: zodResolver(collectorSecuritySchema),
        mode: "onChange",
    });

    // Notification state
    const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
        "email:collection": true,
        "email:activity": true,
        "email:payment": false,
        "inapp:reminders": false,
        "inapp:alerts": true,
    });

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteText, setDeleteText] = useState("");
    const [notificationsChanged, setNotificationsChanged] = useState(false);

    // Pricing state
    const [materials, setMaterials] = useState<Material[]>([
        { id: 1, name: "Glass Bottles", desc: "Clear & Coloured", basePrice: 0.10, bulkRate: 0.12, active: true, icon: "🍾" },
        { id: 2, name: "PET Plastic", desc: "Water & Soft drink bottles", basePrice: 0.05, bulkRate: 0.07, active: true, icon: "🥤" },
        { id: 3, name: "Aluminium Cans", desc: "Beverages only", basePrice: 0.10, bulkRate: 0.15, active: true, icon: "🥫" },
        { id: 4, name: "Cardboard", desc: "Beverages only", basePrice: 0.00, bulkRate: 0.00, active: false, icon: "📦" },
    ]);

    const [serviceFee, setServiceFee] = useState("");
    const [bulkThreshold, setBulkThreshold] = useState("100");
    const [applyBulkToAll, setApplyBulkToAll] = useState(false);

    // Form handlers
    const onSubmitProfile = (data: CollectorProfileFormValues) => {
        console.log("Profile data:", data);
    };

    const onSubmitSecurity = (data: CollectorSecurityFormValues) => {
        console.log("Security data:", data);
        resetSecurity();
    };

    const handleToggleMaterial = (id: number) => {
        setMaterials(materials.map(m => m.id === id ? { ...m, active: !m.active } : m));
    };

    const handlePriceChange = (id: number, field: 'basePrice' | 'bulkRate', value: string) => {
        const numValue = parseFloat(value) || 0;
        setMaterials(materials.map(m => m.id === id ? { ...m, [field]: numValue } : m));
    };

    // Define table columns
    const materialColumns: Column<Material>[] = [
        {
            key: "name",
            header: "Material Category",
            render: (material) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                        {material.icon}
                    </div>
                    <div>
                        <div className="font-medium text-sm">{material.name}</div>
                        <div className="text-xs text-muted-foreground">{material.desc}</div>
                    </div>
                </div>
            ),
        },
        {
            key: "basePrice",
            header: "Base price",
            render: (material) => (
                <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                        value={material.basePrice.toFixed(2)}
                        onChange={(e) => handlePriceChange(material.id, "basePrice", e.target.value)}
                        className="pl-8 h-10 bg-[#F9FAFB] border-gray-200"
                    />
                </div>
            ),
        },
        {
            key: "bulkRate",
            header: "Bulk rate (100+ Units)",
            render: (material) => (
                <div className="relative w-36">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input
                        value={material.bulkRate.toFixed(2)}
                        onChange={(e) => handlePriceChange(material.id, "bulkRate", e.target.value)}
                        className="pl-8 h-10 bg-[#F9FAFB] border-gray-200"
                    />
                </div>
            ),
        },
        {
            key: "active",
            header: "Action",
            render: (material) => (
                <Switch
                    checked={material.active}
                    onCheckedChange={() => handleToggleMaterial(material.id)}
                />
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (material) => (
                <Badge
                    className={`uppercase text-xs font-semibold ${material.active
                            ? "bg-green-100 text-green-800 border-0"
                            : "bg-gray-100 text-gray-600 border-0"
                        }`}
                >
                    {material.active ? "ACTIVE" : "INACTIVE"}
                </Badge>
            ),
        },
    ];

    // Mobile render function
    const renderMobileMaterial = (material: Material) => (
        <>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                        {material.icon}
                    </div>
                    <div>
                        <div className="font-semibold">{material.name}</div>
                        <div className="text-sm text-muted-foreground">{material.desc}</div>
                    </div>
                </div>
                <Switch
                    checked={material.active}
                    onCheckedChange={() => handleToggleMaterial(material.id)}
                />
            </div>

            <div className="space-y-2 pl-15">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Base price:</span>
                    <div className="relative w-28">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">$</span>
                        <Input
                            value={material.basePrice.toFixed(2)}
                            onChange={(e) => handlePriceChange(material.id, "basePrice", e.target.value)}
                            className="pl-6 h-8 text-sm bg-[#F9FAFB]"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bulk rate:</span>
                    <div className="relative w-28">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs">$</span>
                        <Input
                            value={material.bulkRate.toFixed(2)}
                            onChange={(e) => handlePriceChange(material.id, "bulkRate", e.target.value)}
                            className="pl-6 h-8 text-sm bg-[#F9FAFB]"
                        />
                    </div>
                </div>
                <Badge
                    className={`${material.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        } text-xs`}
                >
                    {material.active ? "ACTIVE" : "INACTIVE"}
                </Badge>
            </div>
        </>
    );

    return (
        <div className="p-6 md:p-8">
            <Card className="p-0 bg-white shadow-none border-0">
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                    {/* Profile Header - Only shows on Profile tab */}
                    {currentTab === "profile" && (
                        <div className="p-6 pb-0">
                            <div className="flex items-center gap-6 mb-6">
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-green-100">
                                    <AvatarImage src="/collector-avatar.png" alt="Shahnaz and Sons Recycling" />
                                    <AvatarFallback className="bg-green-100 text-green-600 text-3xl font-semibold">
                                        SS
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl sm:text-4xl font-bold">Shahnaz and Sons Recycling</h1>
                                        <Badge
                                            variant="success"
                                            className="flex px-2 py-1 items-center rounded-[34px] border border-green-800 bg-green-100 text-[10px] sm:text-xs whitespace-nowrap"
                                        >
                                            VERIFIED COLLECTOR
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-base">
                                        Member since January 2026
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="px-8 pt-6">
                        <TabsList>
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="pricing">Pricing</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="notification">Notifications</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="mt-0 p-8 pt-6">
                        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="text-xl">🏢</span> Business Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Legal Business Name"
                                        register={registerProfile("businessName")}
                                        error={profileErrors.businessName?.message}
                                        placeholder="John Doe"
                                        required
                                    />
                                    <InputField
                                        label="Business Email"
                                        register={registerProfile("businessEmail")}
                                        error={profileErrors.businessEmail?.message}
                                        type="email"
                                        placeholder="doe@gmail.com"
                                        disabled
                                        required
                                    />
                                    <InputField
                                        label="Business Phone Number"
                                        register={registerProfile("businessPhone")}
                                        error={profileErrors.businessPhone?.message}
                                        placeholder="1-(306)-0000"
                                        required
                                    />
                                    <InputField
                                        label="Registration Number"
                                        register={registerProfile("registrationNumber")}
                                        error={profileErrors.registrationNumber?.message}
                                        placeholder="doe@gmail.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <MapPin className="h-5 w-5" /> Business Address
                                </h2>
                                <div className="space-y-6">
                                    <div className="relative">
                                        <InputField
                                            label="Address"
                                            register={registerProfile("address")}
                                            error={profileErrors.address?.message}
                                            placeholder="123 Lane Str."
                                            required
                                            className="pl-10"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InputField
                                            label="City"
                                            register={registerProfile("city")}
                                            error={profileErrors.city?.message}
                                            placeholder="Input"
                                            required
                                        />
                                        <InputField
                                            label="Province/State"
                                            register={registerProfile("provinceState")}
                                            error={profileErrors.provinceState?.message}
                                            placeholder="Input"
                                            required
                                        />
                                        <InputField
                                            label="Postal Code"
                                            register={registerProfile("postalCode")}
                                            error={profileErrors.postalCode?.message}
                                            placeholder="Input"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center sm:justify-end gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                                    disabled={!profileIsDirty}
                                    onClick={() => resetProfile()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
                                    disabled={!profileIsDirty}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* Pricing Tab */}
                    <TabsContent value="pricing" className="mt-0 p-8">
                        <div className="space-y-8">
                            {/* Materials Table using DataTable component */}
                            <DataTable
                                data={materials}
                                columns={materialColumns}
                                keyExtractor={(material) => material.id}
                                header={{
                                    title: "Pricing & Materials",
                                    subtitle: "Manage your collection & accepted recycling materials",
                                }}
                                pagination={{
                                    currentPage: currentPage,
                                    totalPages: 5,
                                    onPageChange: setCurrentPage,
                                    showText: "Showing 4 to 12 materials available for ReginaRecycle Collectors.",
                                }}
                                mobileRender={renderMobileMaterial}
                            />

                            {/* Service Fees and Bulk Strategy */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Service Fees */}
                                <Card className="p-6 shadow-none border bg-white">
                                    <h3 className="font-semibold text-base mb-6 flex items-center gap-2">
                                        💳 Service Fees
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-base font-semibold mb-2 block">Base Service Fee (%)</label>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                This is a percentage-based fee applied to every pickup request to cover transport and operational cost
                                            </p>
                                            <div className="relative">
                                                <Input
                                                    value={serviceFee}
                                                    onChange={(e) => setServiceFee(e.target.value)}
                                                    placeholder="Input"
                                                    className="h-11 pr-12 bg-white border-gray-300"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-medium">%</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex items-start gap-3 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg">
                                            <AlertTriangle className="h-5 w-5 text-[#F59E0B] shrink-0" />
                                            <p className="text-sm text-[#78350F]">
                                                These fees will be clearly displayed to the customers during the scheduling process.
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Bulk Incentive */}
                                <Card className="p-6 shadow-none border bg-white">
                                    <h3 className="font-semibold text-base mb-2 flex items-center gap-2">
                                        📈 Bulk Incentive Strategy
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Automatically apply bulk rates when a single request exceeds the quantity threshold.
                                    </p>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-base font-semibold mb-2 block">Standard Bulk Threshold</label>
                                            <div className="relative">
                                                <Input
                                                    value={bulkThreshold}
                                                    onChange={(e) => setBulkThreshold(e.target.value)}
                                                    className="h-11 pr-16 bg-white border-gray-300"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                    Units
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold">Apply Bulk to All Materials</span>
                                            <Switch
                                                checked={applyBulkToAll}
                                                onCheckedChange={setApplyBulkToAll}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-0 p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-1">Security Settings</h2>
                            <p className="text-sm text-muted-foreground">
                                Manage your collectors account and manage primary security actions
                            </p>
                        </div>

                        <form onSubmit={handleSubmitSecurity(onSubmitSecurity)} className="space-y-6">
                            <InputField
                                label="Current Password"
                                register={registerSecurity("currentPassword")}
                                error={securityErrors.currentPassword?.message}
                                type="password"
                                placeholder="Enter current password"
                                showPasswordToggle
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="New Password"
                                    register={registerSecurity("newPassword")}
                                    error={securityErrors.newPassword?.message}
                                    type="password"
                                    placeholder="Enter new password"
                                    showPasswordToggle
                                    required
                                />
                                <InputField
                                    label="Confirm Password"
                                    register={registerSecurity("confirmPassword")}
                                    error={securityErrors.confirmPassword?.message}
                                    type="password"
                                    placeholder="Confirm new password"
                                    showPasswordToggle
                                    required
                                />
                            </div>

                            <div className="flex justify-center sm:justify-end gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-[174px] h-11 min-w-0 border-[rgba(221,30,30,0.60)] text-red-500 hover:bg-red-50 disabled:opacity-60"
                                    disabled={!securityIsDirty}
                                    onClick={() => resetSecurity()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 disabled:opacity-60"
                                    disabled={!securityIsDirty}
                                >
                                    Update Password
                                </Button>
                            </div>
                        </form>

                        <Separator className="my-8" />

                        {/* Danger Zone */}
                        <div className="relative flex flex-col sm:flex-row justify-center items-center w-full max-w-269.5 p-6 sm:p-9 rounded-[14px] border border-red-600 bg-[rgba(221,30,30,0.06)] backdrop-blur-[20px] shrink-0">
                            <img
                                src="/delete-account.png"
                                alt="Delete Account Decor"
                                aria-hidden="true"
                                className="absolute -top-18 -right-30 w-74 sm:w-50 opacity-40 pointer-events-none select-none hidden sm:block"
                            />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Collector Account</h3>
                                    <p className="text-sm text-red-600/80">
                                        Permanently delete your collector profile and all associated data. This action cannot be undone. All active recycling requests and wallet balances must be settled before deletion.
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

                    {/* Notification Tab */}
                    <TabsContent value="notification" className="mt-0 p-8">
                        <div className="space-y-6">
                            {/* Email Notifications */}
                            <div>
                                <div className="flex items-start justify-between mb-6 gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-semibold mb-1">Email Notification</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Receive updates and alerts via your registered email address.
                                        </p>
                                    </div>
                                    <Button
                                        className="w-[174px] h-11 min-w-0 bg-primary hover:bg-primary/90 text-white disabled:opacity-60 shrink-0"
                                        disabled={!notificationsChanged}
                                        onClick={() => setNotificationsChanged(false)}
                                    >
                                        Update Preferences
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <NotificationRow
                                        icon={<Clock className="h-6 w-6" />}
                                        title="New Collection Requests"
                                        description="Get notified 24 hours before your scheduled collection."
                                        checked={notificationPrefs["email:collection"]}
                                        onChange={(checked) => {
                                            setNotificationPrefs({ ...notificationPrefs, "email:collection": checked });
                                            setNotificationsChanged(true);
                                        }}
                                    />
                                    <NotificationRow
                                        icon={<Users className="h-6 w-6" />}
                                        title="Account Activity"
                                        description="Security alert, password changes and login notifications."
                                        checked={notificationPrefs["email:activity"]}
                                        onChange={(checked) => {
                                            setNotificationPrefs({ ...notificationPrefs, "email:activity": checked });
                                            setNotificationsChanged(true);
                                        }}
                                    />
                                    <NotificationRow
                                        icon={<DollarSign className="h-6 w-6" />}
                                        title="Payment"
                                        description="Transaction confirmations, low balance alerts, payout notifications."
                                        checked={notificationPrefs["email:payment"]}
                                        onChange={(checked) => {
                                            setNotificationPrefs({ ...notificationPrefs, "email:payment": checked });
                                            setNotificationsChanged(true);
                                        }}
                                    />
                                </div>
                            </div>

                            <Separator className="my-8" />

                            {/* In-App Notifications */}
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-1">In-App Notification</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Get instant updates within the platform
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <NotificationRow
                                        icon={<Truck className="h-6 w-6" />}
                                        title="Collection Reminders"
                                        description="Receive a text message 1 hour before pickup."
                                        checked={notificationPrefs["inapp:reminders"]}
                                        onChange={(checked) => {
                                            setNotificationPrefs({ ...notificationPrefs, "inapp:reminders": checked });
                                            setNotificationsChanged(true);
                                        }}
                                    />
                                    <NotificationRow
                                        icon={<AlertTriangle className="h-6 w-6" />}
                                        title="Important Alerts"
                                        description="Request cancellations, updates, weather delays, and urgent updates."
                                        checked={notificationPrefs["inapp:alerts"]}
                                        onChange={(checked) => {
                                            setNotificationPrefs({ ...notificationPrefs, "inapp:alerts": checked });
                                            setNotificationsChanged(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="w-[90vw] sm:max-w-[562px] p-6 sm:p-8 [&>button]:hidden mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-100 mb-4 sm:mb-6">
                            <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Delete Account</h2>

                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                            This action is permanent and cannot be undone. All your data, company profile, and history will be lost. To confirm, please type <span className="font-semibold text-foreground">"DELETE"</span> in the box below.
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

// Helper component for notification rows
function NotificationRow({
    icon,
    title,
    description,
    checked,
    onChange,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between h-[73px] px-6 py-3.5 rounded-xl bg-[#F7F7F7] gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex w-[45px] h-[45px] p-2.5 items-center justify-center rounded-lg bg-white shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onChange}
                className="shrink-0"
            />
        </div>
    );
}