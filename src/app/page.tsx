import Header from "@/components/header/header";
import ResumeInput from "@/components/forms/resume-input";
import JdInput from "@/components/forms/jd-input";
import ActionButtons from "@/components/forms/action-buttons";
import EvaluationResult from "@/components/forms/evaluation-result";
import Ruleset from "@/components/rules/ruleset";
import RulesPreview from "@/components/rules/rules-preview";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Header />
      <div>
      <div className="flex flex-row gap-4 p-4 justify-center">
        <div className="flex flex-col w-3/5 gap-4">
          <JdInput />
          <ResumeInput />
          <ActionButtons />
          <Ruleset />
        </div>
        <div className="flex flex-col w-2/5 gap-6">
          <EvaluationResult />
          <RulesPreview />
        </div>
      </div>
      </div>
    </div>
  )
}