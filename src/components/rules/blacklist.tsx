"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

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
                <div className="flex flex-col gap-2 justify-between items-start">
                    <div className="flex flex-row gap-2 justify-start items-center">
                        {isEditing ? (
                            <Switch 
                                id="company-switch" 
                                checked={localBlacklist.companyBlacklistEnabled}
                                onCheckedChange={(checked) => updateBlacklist({ companyBlacklistEnabled: checked === true })}
                            />
                        ) : (
                            <Switch 
                                id="company-switch" 
                                checked={localBlacklist.companyBlacklistEnabled}
                                disabled
                            />
                        )}
                        <Label htmlFor="company" className="text-sm font-normal text-slate-600">If candidate has worked in the following company, it will be immediately marked as NO MATCH.</Label>

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
                        <Input 
                            id="blacklist-input-company"
                            type="text" 
                            className="bg-white"
                            value={localBlacklist.companyBlacklist || "No company specified"}
                            disabled
                        />
                    )}
                </div>
                <div className="flex flex-col gap-1 justify-between items-start">
                    <div className="flex flex-row gap-2 justify-start items-center">
                        {isEditing ? (
                            <Switch 
                                id="degree-switch" 
                                checked={localBlacklist.degreeBlacklistEnabled}
                                onCheckedChange={(checked) => updateBlacklist({ degreeBlacklistEnabled: checked === true })}
                            />
                        ) : (
                            <Switch 
                                id="degree-switch" 
                                checked={localBlacklist.degreeBlacklistEnabled}
                                disabled
                            />
                        )}
                        <Label htmlFor="degree" className="text-sm font-normal text-slate-600">If candidate&apos;s educational degree is in the following list, it will be immediately marked as NO MATCH.</Label>
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
                        <Input 
                            id="blacklist-input-degree"
                            type="text" 
                            className="bg-white"
                            value={localBlacklist.degreeBlacklist || "No degree specified"}
                            disabled
                        />
                    )}
                </div>
            </div>
        </div>
    )
}