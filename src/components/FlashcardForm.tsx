
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flashcard, Category } from "@/context/FlashcardContext";
import { getCategoryName } from "@/lib/helpers";
import { Loader2 } from "lucide-react";
import AIHelper from "./AIHelper";

const formSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters"),
  answer: z.string().min(3, "Answer must be at least 3 characters"),
  category: z.enum(["fullstack", "appdev", "python"] as const),
});

interface FlashcardFormProps {
  initialData?: Flashcard;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      question: "",
      answer: "",
      category: "fullstack" as Category,
    },
  });

  const handleAIGenerate = async (answer: string) => {
    form.setValue("answer", answer);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fullstack">{getCategoryName("fullstack")}</SelectItem>
                  <SelectItem value="appdev">{getCategoryName("appdev")}</SelectItem>
                  <SelectItem value="python">{getCategoryName("python")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your question"
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Answer</FormLabel>
                {form.watch("question") && (
                  <AIHelper
                    question={form.watch("question")}
                    onAnswerGenerated={handleAIGenerate}
                    setIsGenerating={setIsGeneratingAnswer}
                  />
                )}
              </div>
              <FormControl>
                <Textarea
                  placeholder="Enter the answer"
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isGeneratingAnswer}>
            {isGeneratingAnswer ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Save Flashcard"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FlashcardForm;
