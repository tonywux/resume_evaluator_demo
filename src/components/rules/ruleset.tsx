import Blacklist from "@/components/rules/blacklist"
import EvaluationRules from "@/components/rules/evaluation-rules"
import ComposeButton from "@/components/rules/compose-button"
import { Label } from "@/components/ui/label"

export default function Ruleset() {
    return (
        <div className="flex flex-col gap-6 p-6 rounded-lg bg-slate-50">
            <h2 className="text-xl font-bold">Rules</h2>
            <div className="flex flex-col gap-6">
                <Blacklist />
                <EvaluationRules />
            </div>
            <ComposeButton />
        </div>
    )
}