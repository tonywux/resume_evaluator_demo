"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function Blacklist() {
    const [companyBlacklistEnabled, setCompanyBlacklistEnabled] = useState(false)
    const [degreeBlacklistEnabled, setDegreeBlacklistEnabled] = useState(false)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <div className="text-md font-bold">Blacklist</div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 justify-between items-start">
                    <div className="flex flex-row gap-2 justify-between items-center">
                        <Checkbox 
                            id="company" 
                            className="bg-white" 
                            checked={companyBlacklistEnabled}
                            onCheckedChange={(checked) => setCompanyBlacklistEnabled(checked === true)}
                        />
                        <Label htmlFor="company" className="text-sm text-slate-600">If candidate has worked in the following company, it will be immediately marked as <span className="font-bold text-red-500">NO MATCH</span></Label>
                    </div>
                    <Input 
                        id="blacklist-input-company"
                        type="text" 
                        placeholder="Enter company name here" 
                        className="bg-white"
                        disabled={!companyBlacklistEnabled}
                    />
                </div>
                <div className="flex flex-col gap-1 justify-between items-start">
                    <div className="flex flex-row gap-2 justify-between items-center">
                        <Checkbox 
                            id="degree" 
                            className="bg-white" 
                            checked={degreeBlacklistEnabled}
                            onCheckedChange={(checked) => setDegreeBlacklistEnabled(checked === true)}
                        />
                        <Label htmlFor="degree" className="text-sm text-slate-600">If candidate's educational degree is in the following list, it will be immediately marked as <span className="font-bold text-red-500">NO MATCH</span></Label>
                    </div>
                    <Input 
                        id="blacklist-input-degree"
                        type="text" 
                        placeholder="Enter educational degree here" 
                        className="bg-white"
                        disabled={!degreeBlacklistEnabled}
                    />
                </div>
            </div>
        </div>
    )
}