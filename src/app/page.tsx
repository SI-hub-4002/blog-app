import MainContent from "@/components/features/MainContents/MainContents";
import SelectButton from "@/components/features/SelectButton/SelectButton";

export default function Home() {
  return (
    <div className="h-full">
      <SelectButton />
      <MainContent />
    </div>
  );
}
