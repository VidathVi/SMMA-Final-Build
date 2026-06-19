"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Transition out of loading screen to signin
      router.push("/signin");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return <LoadingScreen />;
}
