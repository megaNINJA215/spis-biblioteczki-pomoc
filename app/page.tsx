import BooksSection from "./components/BooksSection";
import ScannerSection from "./components/ScannerSection";
import Separator from "./components/Separator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col select-none">
      <ScannerSection />
      <Separator />
      <BooksSection />
    </div>
  );
}
