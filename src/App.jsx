import { useRef } from "react";
import { gsap, useGSAP } from "./lib/gsap.js";

export default function App() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".box", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      });
    },
    { scope: container }
  );

  return (
    <main ref={container}>
      <h1>Ai-B</h1>
      <div className="box">GSAP is wired up.</div>
      <div className="box">Every plugin above is registered.</div>
    </main>
  );
}
