import Header from "@/components/header/header";
import ResumeInput from "@/components/forms/resume-input";
import JdInput from "@/components/forms/jd-input";
import ActionButtons from "@/components/forms/action-buttons";
import EvaluationResult from "@/components/forms/evaluation-result";
import Ruleset from "@/components/rules/ruleset";
import Ruleset2 from "@/components/rules_2/ruleset_2";
import { InputProvider } from "@/lib/hooks/useInputs";
import { EvaluationProvider } from "@/lib/hooks/useEvaluation";
import { EvaluationProviderB } from "@/lib/hooks/useEvaluationB";

export default function Home() {
  return (
    <InputProvider>
      <EvaluationProvider>
        <EvaluationProviderB>
          <div className="flex flex-col gap-4 p-4">
            <Header />
            <div>
            <div className="flex flex-row gap-4 p-4 justify-center">
              <div className="flex flex-col w-3/5 gap-4">
                <JdInput />
                <ResumeInput />
                <ActionButtons />
                <Ruleset />
                <Ruleset2 />
              </div>
              <div className="flex flex-col w-2/5 gap-6">
                <EvaluationResult />
              </div>
            </div>
            </div>
          </div>
        </EvaluationProviderB>
      </EvaluationProvider>
    </InputProvider>
  )
}