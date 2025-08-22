import KeyConfigModal from "@/components/header/key-config-modal"
import { Badge } from "@/components/ui/badge"

export default function Header() {
    return (
        <div className="flex justify-between items-center h-20 p-4 gap-4 border-b-3 border-slate-700">
            <div className="flex flex-row justify-start items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">AI Resume Evaluator</h1>
                <Badge variant="outline" className="text-xs text-slate-800">For HR Screening</Badge>
            </div>
            <KeyConfigModal />
        </div>
    )
}