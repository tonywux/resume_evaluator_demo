"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface BlacklistConfig {
    companyBlacklistEnabled: boolean
    companyBlacklist: string
    degreeBlacklistEnabled: boolean
    degreeBlacklist: string
}

interface BlacklistProps {
    isEditing: boolean
    blacklist: BlacklistConfig
    onBlacklistChange?: (blacklist: BlacklistConfig) => void
}

export default function Blacklist({ isEditing, blacklist, onBlacklistChange }: BlacklistProps) {
    const [localBlacklist, setLocalBlacklist] = useState<BlacklistConfig>(blacklist)

    // Sync with external blacklist when it changes
    useEffect(() => {
        setLocalBlacklist(blacklist)
    }, [blacklist])

    const updateBlacklist = (updates: Partial<BlacklistConfig>) => {
        const newBlacklist = { ...localBlacklist, ...updates }
        setLocalBlacklist(newBlacklist)
        if (isEditing && onBlacklistChange) {
            onBlacklistChange(newBlacklist)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="text-md font-bold">Blacklist</div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 justify-between items-start">
                    <div className="flex flex-row gap-2 justify-between items-center">
                        {isEditing ? (
                            <Checkbox 
                                id="company" 
                                className="bg-white" 
                                checked={localBlacklist.companyBlacklistEnabled}
                                onCheckedChange={(checked) => updateBlacklist({ companyBlacklistEnabled: checked === true })}
                            />
                        ) : (
                            <div className="w-4 h-4 flex items-center justify-center">
                                {localBlacklist.companyBlacklistEnabled ? "✓" : "✗"}
                            </div>
                        )}
                        <Label htmlFor="company" className="text-sm text-slate-600">If candidate has worked in the following company, it will be immediately marked as <span className="font-bold text-red-500">NO MATCH</span></Label>
                    </div>
                    {isEditing ? (
                        <Input 
                            id="blacklist-input-company"
                            type="text" 
                            placeholder="Enter company name here" 
                            className="bg-white"
                            value={localBlacklist.companyBlacklist}
                            onChange={(e) => updateBlacklist({ companyBlacklist: e.target.value })}
                            disabled={!localBlacklist.companyBlacklistEnabled}
                        />
                    ) : (
                        <div className="p-2 border rounded bg-gray-50 text-sm">
                            {localBlacklist.companyBlacklistEnabled ? (localBlacklist.companyBlacklist || "No company specified") : "Disabled"}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-1 justify-between items-start">
                    <div className="flex flex-row gap-2 justify-between items-center">
                        {isEditing ? (
                            <Checkbox 
                                id="degree" 
                                className="bg-white" 
                                checked={localBlacklist.degreeBlacklistEnabled}
                                onCheckedChange={(checked) => updateBlacklist({ degreeBlacklistEnabled: checked === true })}
                            />
                        ) : (
                            <div className="w-4 h-4 flex items-center justify-center">
                                {localBlacklist.degreeBlacklistEnabled ? "✓" : "✗"}
                            </div>
                        )}
                        <Label htmlFor="degree" className="text-sm text-slate-600">If candidate's educational degree is in the following list, it will be immediately marked as <span className="font-bold text-red-500">NO MATCH</span></Label>
                    </div>
                    {isEditing ? (
                        <Input 
                            id="blacklist-input-degree"
                            type="text" 
                            placeholder="Enter educational degree here" 
                            className="bg-white"
                            value={localBlacklist.degreeBlacklist}
                            onChange={(e) => updateBlacklist({ degreeBlacklist: e.target.value })}
                            disabled={!localBlacklist.degreeBlacklistEnabled}
                        />
                    ) : (
                        <div className="p-2 border rounded bg-gray-50 text-sm">
                            {localBlacklist.degreeBlacklistEnabled ? (localBlacklist.degreeBlacklist || "No degree specified") : "Disabled"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}