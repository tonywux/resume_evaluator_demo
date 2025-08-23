'use client';

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useInputs } from "@/lib/hooks/useInputs"

export default function JdInput() {
    const { jobDescription, setJobDescription } = useInputs();

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="jd-input">Job Description</Label>
            <Textarea 
                id="jd-input"
                placeholder="Paste job description content here" 
                className="h-48"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />
        </div>
    )
}