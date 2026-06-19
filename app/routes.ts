import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout("layouts/layout-main.tsx", [
        index("routes/dashboard.tsx"),
        route("budgets", "routes/budgets.tsx"),
    ]),
    route("signin", "routes/signin.tsx"),
    route("signup", "routes/signup.tsx"),
    route(".well-known/appspecific/com.chrome.devtools.json", "routes/dummy-chrome.tsx"),
    route("*", "routes/notFound.tsx")
] satisfies RouteConfig;
