import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function JdInput() {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="jd-input">Job Description</Label>
            <Textarea 
                id="jd-input"
                placeholder="Paste job description content here" 
                className="h-64"
            />
        </div>
    )
}