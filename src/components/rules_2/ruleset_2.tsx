"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { EditIcon, SaveIcon, XIcon, CopyIcon } from "lucide-react"
import { 
    saveRuleset2, 
    loadRuleset2, 
    type Ruleset2Data,
    isBrowser 
} from "@/lib/functions/storage"
import { toast } from "sonner"

const defaultRuleset2: Ruleset2Data = {
    systemPrompt: "",
    userPrompt: ""
}

export default function Ruleset2() {
    const [isEditing, setIsEditing] = useState(false)
    const [ruleset2, setRuleset2] = useState<Ruleset2Data>(defaultRuleset2)
    const [originalData, setOriginalData] = useState<Ruleset2Data | null>(null)

    // Load data from localStorage on component mount
    useEffect(() => {
        if (isBrowser()) {
            const savedRuleset2 = loadRuleset2()
            if (savedRuleset2) {
                setRuleset2(savedRuleset2)
                setOriginalData(savedRuleset2)
            }
        }
    }, [])

    const handleEdit = () => {
        // Store current data as backup for cancel functionality
        setOriginalData(ruleset2)
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            if (isBrowser()) {
                saveRuleset2(ruleset2)
                toast.success("Success", {
                    description: "Ruleset 2 has been saved to local storage.",
                })
            }
            
            setIsEditing(false)
            setOriginalData(null)
        } catch (error) {
            console.error("Failed to save ruleset2:", error)
            toast.error("Failed", {
                description: "Failed to save ruleset 2. Please try again."
            })
        }
    }

    const handleCancel = () => {
        // Restore original data
        if (originalData) {
            setRuleset2(originalData)
        }
        setIsEditing(false)
        setOriginalData(null)
    }

    // Memoize callback functions to prevent infinite re-renders
    const handleSystemPromptChange = useCallback((value: string) => {
        setRuleset2(prev => ({ ...prev, systemPrompt: value }))
    }, [])

    const handleUserPromptChange = useCallback((value: string) => {
        setRuleset2(prev => ({ ...prev, userPrompt: value }))
    }, [])

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success("Copied to clipboard", {
                description: `"${text}" has been copied to your clipboard.`,
            })
        } catch (error) {
            console.error("Failed to copy to clipboard:", error)
            toast.error("Failed to copy", {
                description: "Failed to copy to clipboard. Please try again."
            })
        }
    }

    const responseFormat = `
    {
        "totalScore": 总分,
        "reasons": [
        {
        "item": "评价维度",
        "score": 维度得分,
        "reason": "该维度的评价分析"
        }
        ]
    }
    `

    return (
        <div className="flex flex-col gap-6 p-6 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Rules [Approach B]</h2>
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
                {/* System Prompt Section */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="system-prompt" className="text-md font-bold">
                        System Prompt
                    </Label>
                    <div className="text-sm text-slate-600">
                        <span className="mr-1">Define the system-level instructions that will guide the AI's behavior during evaluation. Make sure to use the following response format:</span>
                    </div>
                    <Badge 
                        variant="secondary" 
                        className="font-bold cursor-pointer hover:bg-slate-200 transition-colors flex items-center gap-1"
                        onClick={() => copyToClipboard(responseFormat)}
                        title="Click to copy"
                    >
                        {responseFormat}
                        <CopyIcon className="w-3 h-3" />
                    </Badge>
                    {isEditing ? (
                        <Textarea
                            id="system-prompt"
                            placeholder="Enter system prompt here..."
                            value={ruleset2.systemPrompt}
                            onChange={(e) => handleSystemPromptChange(e.target.value)}
                            className="bg-white min-h-[120px] resize-y"
                        />
                    ) : (
                        <Textarea
                            id="system-prompt"
                            value={ruleset2.systemPrompt || "No system prompt specified"}
                            className="bg-white min-h-[120px] resize-y"
                            disabled
                        />
                    )}
                </div>

                {/* User Prompt Section */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="user-prompt" className="text-md font-bold">
                        User Prompt
                    </Label>
                    <div className="text-sm text-slate-600">
                        Define the user-level instructions or template that will be used for evaluation requests. Make sure to contain the following placeholders:
                    </div>
                    <div className="flex text-sm text-slate-600 mb-2 gap-2">
                        <Badge 
                            variant="secondary" 
                            className="font-bold cursor-pointer hover:bg-slate-200 transition-colors flex items-center gap-1"
                            onClick={() => copyToClipboard('{resume}')}
                            title="Click to copy"
                        >
                            {'{resume}'}
                            <CopyIcon className="w-3 h-3" />
                        </Badge>
                        <Badge 
                            variant="secondary" 
                            className="font-bold cursor-pointer hover:bg-slate-200 transition-colors flex items-center gap-1"
                            onClick={() => copyToClipboard('{jobDescription}')}
                            title="Click to copy"
                        >
                            {'{jobDescription}'}
                            <CopyIcon className="w-3 h-3" />
                        </Badge>
                    </div>
                    {isEditing ? (
                        <Textarea
                            id="user-prompt"
                            placeholder="Enter user prompt here..."
                            value={ruleset2.userPrompt}
                            onChange={(e) => handleUserPromptChange(e.target.value)}
                            className="bg-white min-h-[120px] resize-y"
                        />
                    ) : (
                        <Textarea
                            id="user-prompt"
                            value={ruleset2.userPrompt || "No user prompt specified"}
                            className="bg-white min-h-[120px] resize-y"
                            disabled
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
