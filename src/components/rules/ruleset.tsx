"use client"

import { useState, useEffect, useCallback } from "react"
import Blacklist from "@/components/rules/blacklist"
import EvaluationRules from "@/components/rules/evaluation-rules"
import { Button } from "@/components/ui/button"
import { EditIcon, SaveIcon, XIcon } from "lucide-react"
import { 
    saveRuleset, 
    loadRuleset, 
    type RulesetData, 
    type Rule, 
    type BlacklistConfig,
    isBrowser 
} from "@/lib/functions/storage"
import { toast } from "sonner"

const defaultRules: Rule[] = [
    { id: "1", description: "", weight: 1.0 }
]

const defaultBlacklist: BlacklistConfig = {
    companyBlacklistEnabled: false,
    companyBlacklist: "",
    degreeBlacklistEnabled: false,
    degreeBlacklist: ""
}

export default function Ruleset() {
    const [isEditing, setIsEditing] = useState(false)
    const [rules, setRules] = useState<Rule[]>(defaultRules)
    const [blacklist, setBlacklist] = useState<BlacklistConfig>(defaultBlacklist)
    const [originalData, setOriginalData] = useState<RulesetData | null>(null)

    // Load data from localStorage on component mount
    useEffect(() => {
        if (isBrowser()) {
            const savedRuleset = loadRuleset()
            if (savedRuleset) {
                setRules(savedRuleset.evaluationRules)
                setBlacklist(savedRuleset.blacklist)
                setOriginalData(savedRuleset)
            }
        }
    }, [])

    const handleEdit = () => {
        // Store current data as backup for cancel functionality
        setOriginalData({ evaluationRules: rules, blacklist })
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            const rulesetData: RulesetData = {
                evaluationRules: rules,
                blacklist
            }
            
            if (isBrowser()) {
                saveRuleset(rulesetData)
                toast.success("Ruleset saved successfully!")
            }
            
            setIsEditing(false)
            setOriginalData(null)
        } catch (error) {
            console.error("Failed to save ruleset:", error)
            toast.error("Failed to save ruleset. Please try again.")
        }
    }

    const handleCancel = () => {
        // Restore original data
        if (originalData) {
            setRules(originalData.evaluationRules)
            setBlacklist(originalData.blacklist)
        }
        setIsEditing(false)
        setOriginalData(null)
    }

    // Memoize callback functions to prevent infinite re-renders
    const handleRulesChange = useCallback((newRules: Rule[]) => {
        setRules(newRules)
    }, [])

    const handleBlacklistChange = useCallback((newBlacklist: BlacklistConfig) => {
        setBlacklist(newBlacklist)
    }, [])

    return (
        <div className="flex flex-col gap-6 p-6 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Rules</h2>
                {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline" size="sm">
                        <EditIcon className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={handleSave} variant="default" size="sm">
                            <SaveIcon className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">
                            <XIcon className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-6">
                <Blacklist 
                    isEditing={isEditing}
                    blacklist={blacklist}
                    onBlacklistChange={handleBlacklistChange}
                />
                <EvaluationRules 
                    isEditing={isEditing}
                    rules={rules}
                    onRulesChange={handleRulesChange}
                />
            </div>
        </div>
    )
}