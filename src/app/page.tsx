import { Metadata } from "next";
import HomeView from "../sections/home/view/home-view";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function Home() {
  return (
    <HomeView />
  );
}
