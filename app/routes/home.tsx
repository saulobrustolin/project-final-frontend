import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project final" },
    { name: "description", content: "It's my project final in order to approved in my university (UPF)" },
  ];
}
