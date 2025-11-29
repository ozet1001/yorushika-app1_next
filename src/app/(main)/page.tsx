import { getSongs } from "@/lib/songs";
import Main from "@/app/components/Main/Main";

export default async function HomePage() {
  const allSongs = await getSongs();
  return <Main songsData={allSongs} />;
}