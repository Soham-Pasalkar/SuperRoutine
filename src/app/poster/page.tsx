import { notFound } from "next/navigation";
import PosterClient from "./PosterClient";

export default function PosterPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PosterClient />;
}
