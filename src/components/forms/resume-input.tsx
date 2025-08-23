'use client';

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useInputs } from "@/lib/hooks/useInputs"

export default function ResumeInput() {
    const { resume, setResume } = useInputs();

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="resume-input">Resume Content</Label>
            <Textarea 
                id="resume-input"
                placeholder="Paste resume content here" 
                className="h-48"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
            />
        </div>
    )
}