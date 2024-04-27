import SPA from "@/components/spa";
import NoSsr from "@/components/no-ssr";

export default function Home() {
  return (
    <NoSsr>
      <SPA/>
    </NoSsr>
  );
}
