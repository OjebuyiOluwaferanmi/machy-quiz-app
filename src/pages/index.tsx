import Navindex from "@/components/Navindex";
import { Button } from "@heroui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import Typed from "typed.js";

export default function IndexPage() {
  const typedRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["everyone", "you", "me", "us"],
      typeSpeed: 100,
      backSpeed: 80,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  return (
    <div className="overflow-hidden h-screen">
      <Navindex />
      <div className="flex flex-col items-center justify-center gap-3" style={{ height: "calc(100vh - 130px)" }}>
        <h1 className="text-5xl font-bold text-gray-800 max-w-4xl mx-3 text-center">
          Meet <span className="text-blue-700">MickQz.</span> The free, interactive quiz app for{" "}
          <span ref={typedRef} className="text-blue-700"></span>
        </h1>
        <p className="text-lg text-gray-600 text-center">Your ultimate quiz app for fun and learning.</p>
        <Button as={RouterLink} to="/signup" className="bg-blue-700 text-white rounded-md" size="lg">
          Start a Quiz
        </Button>
      </div>
    </div>
  );
}