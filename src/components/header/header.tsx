import KeyConfigModal from "@/components/header/key-config-modal"

export default function Header() {
    return (
        <div className="flex justify-left items-center h-20 p-4 gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Resume Evaluator</h1>
            <KeyConfigModal />
        </div>
    )
}