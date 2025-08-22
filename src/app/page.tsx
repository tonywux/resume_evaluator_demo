import Header from "@/components/header/header";
import ResumeInput from "@/components/forms/resume-input";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Header />
      <ResumeInput />
    </div>
  )
}