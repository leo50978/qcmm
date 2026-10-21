import { cp, mkdir, rm } from "node:fs/promises";

await rm("site", { recursive: true, force: true });
await mkdir("site", { recursive: true });
for (const path of ["index.html", "404.html", "assets", "src"]) await cp(path, `site/${path}`, { recursive: true });
await mkdir("site/dist", { recursive: true });
await cp("dist/tailwind.css", "site/dist/tailwind.css");
console.log("GitHub Pages files staged in site/");
