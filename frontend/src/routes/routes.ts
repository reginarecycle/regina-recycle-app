export enum Routes {
    base = "/",
    learn = "/learn",
    about = "/about",

    //auth
    onboarding = "/auth",
    login = "/auth/login",
    forgot = "/auth/forgot",
    reset = "/auth/reset",
    register = "auth/register",
    verification = "/auth/verification",
    success = "/auth/success",
    collectorRegister = "/auth/collector",

    //dashboard
    app = "/app",
    dashboard = "/app/dashboard",
    collectorapp = "/app/collector",
    collectordashboard = "/app/collector/dashboard",
    collectorsettings = "/app/collector/settings",

    //profile
    profile = "/app/profile",

    //collector requests
    requests = "/app/collector/requests",
}