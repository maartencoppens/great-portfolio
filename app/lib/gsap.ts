import { gsap as gsapCore } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsapCore.registerPlugin(ScrollTrigger, ScrollSmoother);

export const gsap = gsapCore;
export { ScrollTrigger, ScrollSmoother };
