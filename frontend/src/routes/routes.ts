export enum Routes {
    base = "/",
    learn = "/learn",
    about = "/about",
    denied = "/denied",

    //auth
    onboarding = "/auth",
    login = "/auth/login",
    forgot = "/auth/forgot",
    reset = "/auth/reset",
    register = "/auth/register",
    verification = "/auth/verification",
    success = "/auth/success",
    collectorRegister = "/auth/collector",

    //dashboard
    app = "/app",
    dashboard = "/app/dashboard",
    schedulePickup = "/app/schedule",
    schedulePickupTime = "/app/schedule/pickupTime",
    schedulePickupLoc = "/app/schedule/pickupLoc",
    collectorapp = "/app/collector",
    collectordashboard = "/app/collector/dashboard",
    collectorsettings = "/app/collector/settings",
    collectornotifications = "/app/collector/notification",
    collectorwallet = "/app/collector/wallet",
    collectorusers = "/app/collector/users",
    requests = "/app/collector/requests",

    //profile
    profile = "/app/profile",
    profileSection = "/app/profile/:section",

    //notifications
    notifications = "/app/notification",

    //collector requests
    history = "/app/history",
    wallet = "/app/wallet",
}