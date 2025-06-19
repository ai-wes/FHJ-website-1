"use client";

import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ tags, onTagsChange, className, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
          onTagsChange([...tags, newTag]);
        }
        setInputValue("");
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        onTagsChange(tags.slice(0, -1));
      }
    };

    const removeTag = (tagToRemove: string) => {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-md border border-input bg-background p-2",
          className
        )}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="group">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <Input
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length > 0 ? "" : "Add tags..."}
          className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          {...props}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };
