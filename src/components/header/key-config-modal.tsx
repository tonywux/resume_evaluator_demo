"use client"

import { useEffect, useState } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { saveConfig, loadConfig, clearConfig, isBrowser, ApiConfig } from "@/lib/functions/storage";
import { toast } from "sonner";

export default function KeyConfigModal() {
  const [storedConfig, setStoredConfig] = useState<ApiConfig>({ provider: "", key: "" });
  const [draftProvider, setDraftProvider] = useState("");
  const [draftKey, setDraftKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load config from localStorage on component mount
  useEffect(() => {
    if (isBrowser()) {
      const savedConfig = loadConfig();
      if (savedConfig) {
        setStoredConfig(savedConfig);
      }
    }
  }, []);

  // When opening, load the draft from the stored values
  useEffect(() => {
    if (isOpen) {
      setDraftProvider(storedConfig.provider);
      setDraftKey(storedConfig.key);
    }
  }, [isOpen, storedConfig]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hover:cursor-pointer">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter your LLM API key to use the resume evaluator.
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 justify-between w-full">
            <Select value={draftProvider} onValueChange={setDraftProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="qwen">Qwen</SelectItem>
                <SelectItem value="deepseek">Deepseek</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full">
            <Input
              id="api-key-input"
              type={showKey ? "text" : "password"}
              placeholder="Paste your API key here"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              className="pr-10"
            />
            {draftKey && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey((s) => !s)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            )}
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between">
            <div className="flex flex-row">
                <Button 
                variant="ghost" 
                onClick={() => {
                    try {
                      toast.success('Config cleared', {
                        description: 'Your configuration has been cleared',
                      });
                      clearConfig();
                      setDraftProvider("");
                      setDraftKey("");
                      setStoredConfig({ provider: "", key: "" });
                      setIsOpen(false);
                      console.log('Config cleared');
                    } catch (error) {
                      toast.error('Failed to clear config', {
                        description: 'Please try again',
                      });
                      console.error('Failed to clear config:', error);
                    }
                }}>
                    Reset
                </Button>
            </div>

            <div className="flex justify-end gap-2">
            <Button
                disabled={!draftProvider || !draftKey}
                onClick={() => {
                const newConfig = { provider: draftProvider, key: draftKey };
                try {
                  toast.success('Config saved', {
                    description: 'Your configuration has been saved',
                  });
                  saveConfig(newConfig);
                  setStoredConfig(newConfig);
                  setIsOpen(false);
                  console.log('Config saved');
                } catch (error) {
                  toast.error('Failed to save config', {
                    description: 'Please try again',
                  });
                  console.error('Failed to save config:', error);
                }
                }}
            >
                Save
            </Button>
            <Button
                variant="secondary"
                onClick={() => {
                setIsOpen(false);
                setShowKey(false);
                }}
            >
                Cancel
            </Button>
            </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
