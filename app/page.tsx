import BooksSection from "./components/BooksSection";
import ScannerSection from "./components/ScannerSection";
import Separator from "./components/Separator";

export default function Home() {
  return (
    <div className="bg-gray-200 min-h-full flex flex-col select-none">
      <ScannerSection />
      <Separator />
      <BooksSection />
    </div>
  );
}
