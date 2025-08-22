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

export default function EvaluationRules() {
    const [rules, setRules] = useState<Rule[]>([
        { id: "1", description: "", weight: 1.0 }
    ])
    const [weightError, setWeightError] = useState<string>("")

    // Calculate total weight and validate
    useEffect(() => {
        const totalWeight = rules.reduce((sum, rule) => sum + rule.weight, 0)
        const roundedTotal = Math.round(totalWeight * 10) / 10 // Round to 1 decimal place
        
        // Check for invalid individual weights
        const invalidWeights = rules.filter(rule => rule.weight < 0.1 || rule.weight > 1.0)
        
        if (invalidWeights.length > 0) {
            setWeightError("Each weight must be between 0.1 and 1.0")
        } else if (roundedTotal !== 1.0) {
            setWeightError(`Total weight must equal 1.0 (currently ${roundedTotal.toFixed(1)})`)
        } else {
            setWeightError("")
        }
    }, [rules])

    const addRule = () => {
        const newRule: Rule = {
            id: Date.now().toString(),
            description: "",
            weight: 0.1
        }
        setRules([...rules, newRule])
    }

    const removeRule = (id: string) => {
        if (rules.length > 1) {
            setRules(rules.filter(rule => rule.id !== id))
        }
    }

    const updateRuleDescription = (id: string, description: string) => {
        setRules(rules.map(rule => 
            rule.id === id ? { ...rule, description } : rule
        ))
    }

    const updateRuleWeight = (id: string, weight: number) => {
        // Allow any input during typing, validation happens in useEffect
        setRules(rules.map(rule => 
            rule.id === id ? { ...rule, weight } : rule
        ))
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
            
            <div className="flex flex-col gap-4">
                {rules.map((rule, index) => (
                    <div key={rule.id} className="flex flex-row gap-2 justify-between items-center">
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
                            disabled={rules.length === 1}
                            className={rules.length === 1 ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            <TrashIcon className="w-4 h-4" />
                        </Button>
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
