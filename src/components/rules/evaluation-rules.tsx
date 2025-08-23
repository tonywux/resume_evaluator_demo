"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, TrashIcon } from "lucide-react"

interface Rule {
    id: string
    description: string
    weight: number
}

interface EvaluationRulesProps {
    isEditing: boolean
    rules: Rule[]
    onRulesChange?: (rules: Rule[]) => void
}

export default function EvaluationRules({ isEditing, rules, onRulesChange }: EvaluationRulesProps) {
    const [localRules, setLocalRules] = useState<Rule[]>(rules)
    const [weightError, setWeightError] = useState<string>("")

    // Sync with external rules when they change
    useEffect(() => {
        setLocalRules(rules)
    }, [rules])

    // Calculate total weight and validate
    useEffect(() => {
        const totalWeight = localRules.reduce((sum, rule) => sum + rule.weight, 0)
        const roundedTotal = Math.round(totalWeight * 10) / 10 // Round to 1 decimal place
        
        // Check for invalid individual weights
        const invalidWeights = localRules.filter(rule => rule.weight < 0.1 || rule.weight > 1.0)
        
        if (invalidWeights.length > 0) {
            setWeightError("Each weight must be between 0.1 and 1.0")
        } else if (roundedTotal !== 1.0) {
            setWeightError(`Total weight must equal 1.0 (currently ${roundedTotal.toFixed(1)})`)
        } else {
            setWeightError("")
        }
    }, [localRules])

    const addRule = () => {
        const newRule: Rule = {
            id: Date.now().toString(),
            description: "",
            weight: 0.1
        }
        const newRules = [...localRules, newRule]
        setLocalRules(newRules)
        if (isEditing && onRulesChange) {
            onRulesChange(newRules)
        }
    }

    const removeRule = (id: string) => {
        if (localRules.length > 1) {
            const newRules = localRules.filter(rule => rule.id !== id)
            setLocalRules(newRules)
            if (isEditing && onRulesChange) {
                onRulesChange(newRules)
            }
        }
    }

    const updateRuleDescription = (id: string, description: string) => {
        const newRules = localRules.map(rule => 
            rule.id === id ? { ...rule, description } : rule
        )
        setLocalRules(newRules)
        if (isEditing && onRulesChange) {
            onRulesChange(newRules)
        }
    }

    const updateRuleWeight = (id: string, weight: number) => {
        // Allow any input during typing, validation happens in useEffect
        const newRules = localRules.map(rule => 
            rule.id === id ? { ...rule, weight } : rule
        )
        setLocalRules(newRules)
        if (isEditing && onRulesChange) {
            onRulesChange(newRules)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="text-md font-bold">Evaluation Rules</div>
                <div className="text-sm text-slate-600">
                    Please set up the rules for the evaluation process. 
                    Each rule will be scored on a scale from 0 to 5. You can also assign a weight (0.1 – 1.0) to indicate the importance of each rule in the overall evaluation.
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                {localRules.map((rule, index) => (
                    <div key={rule.id} className="flex flex-row gap-2 justify-between items-center">
                        {isEditing ? (
                            <>
                                <Input 
                                    id={`evaluation-rule-description-${rule.id}`}
                                    type="text" 
                                    placeholder="Enter rules description here"
                                    value={rule.description}
                                    onChange={(e) => updateRuleDescription(rule.id, e.target.value)}
                                    className="bg-white"
                                />
                                <Input 
                                    id={`evaluation-rule-weight-${rule.id}`}
                                    type="number" 
                                    placeholder="Weight" 
                                    className="w-36 bg-white"
                                    value={rule.weight}
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    onChange={(e) => {
                                        const value = e.target.value
                                        // Allow empty string or valid numbers (including partial input like "0.")
                                        if (value === "" || !isNaN(parseFloat(value))) {
                                            updateRuleWeight(rule.id, value === "" ? 0 : parseFloat(value))
                                        }
                                    }}
                                />
                                {index === 0 && (
                                    <Button variant="ghost" onClick={addRule}>
                                        <PlusIcon className="w-4 h-4" />
                                    </Button>
                                )}
                                {index > 0 && (
                                    <Button variant="ghost" onClick={addRule}>
                                        <PlusIcon className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button 
                                    variant="ghost" 
                                    onClick={() => removeRule(rule.id)}
                                    disabled={localRules.length === 1}
                                    className={localRules.length === 1 ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    id={`evaluation-rule-description-${rule.id}`}
                                    type="text" 
                                    value={rule.description || "No description specified"}
                                    className="bg-white"
                                    disabled
                                />
                                <Input 
                                    id={`evaluation-rule-weight-${rule.id}`}
                                    type="number" 
                                    className="w-36 bg-white"
                                    value={rule.weight}
                                    disabled
                                />
                            </>
                        )}
                    </div>
                ))}
                
                {weightError && (
                    <div className="text-sm text-red-500 font-medium">
                        {weightError}
                    </div>
                )}
            </div>
        </div>
    )
}
