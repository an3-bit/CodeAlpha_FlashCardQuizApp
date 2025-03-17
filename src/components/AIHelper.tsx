
import React, { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIHelperProps {
  question: string;
  onAnswerGenerated: (answer: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const AIHelper: React.FC<AIHelperProps> = ({
  question,
  onAnswerGenerated,
  setIsGenerating,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateAnswer = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question first");
      return;
    }
    
    setIsLoading(true);
    setIsGenerating(true);
    
    // Simulate AI response with a delay
    // In a real implementation, this would be an API call to an AI service
    setTimeout(() => {
      try {
        // Generate answers based on category clues in the question
        let answer = "";
        
        if (question.toLowerCase().includes("react") || question.toLowerCase().includes("javascript") || question.toLowerCase().includes("html")) {
          answer = mockFullstackAnswer(question);
        } else if (question.toLowerCase().includes("swift") || question.toLowerCase().includes("kotlin") || question.toLowerCase().includes("app")) {
          answer = mockAppDevAnswer(question);
        } else if (question.toLowerCase().includes("python") || question.toLowerCase().includes("django")) {
          answer = mockPythonAnswer(question);
        } else {
          answer = "This is a simulated AI-generated answer. In a real implementation, this would connect to an AI service API to generate a relevant response based on your question.";
        }
        
        onAnswerGenerated(answer);
        toast.success("Answer generated successfully");
      } catch (error) {
        toast.error("Failed to generate answer. Please try again.");
        console.error("Error generating answer:", error);
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    }, 1500);
  };

  const mockFullstackAnswer = (question: string): string => {
    if (question.toLowerCase().includes("react")) {
      return "React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM to efficiently update the UI. React was developed by Facebook and is widely used for single-page applications and mobile app development with React Native.";
    } else if (question.toLowerCase().includes("javascript")) {
      return "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It's primarily used for client-side web development but has expanded to server-side with Node.js. JavaScript enables interactive web pages and is an essential part of web applications.";
    } else {
      return "Fullstack development involves working with both frontend and backend technologies. Frontend deals with what users see and interact with (using HTML, CSS, JavaScript), while backend handles server-side logic, databases, and application architecture (using technologies like Node.js, Python, Ruby, etc.).";
    }
  };

  const mockAppDevAnswer = (question: string): string => {
    if (question.toLowerCase().includes("swift")) {
      return "Swift is a powerful and intuitive programming language developed by Apple for iOS, macOS, watchOS, and tvOS app development. It's designed to be safe, fast, and expressive. Swift code is compiled and optimized to get the most out of modern hardware.";
    } else if (question.toLowerCase().includes("kotlin")) {
      return "Kotlin is a cross-platform, statically typed, general-purpose programming language with type inference. It's designed to interoperate fully with Java, and the JVM version of Kotlin's standard library depends on the Java Class Library. Google announced Kotlin as a first-class language for Android development in 2017.";
    } else {
      return "App development involves creating software applications that run on mobile devices like smartphones and tablets. The main platforms are Android (using Java or Kotlin) and iOS (using Swift or Objective-C). Modern app development often involves cross-platform frameworks like React Native or Flutter.";
    }
  };

  const mockPythonAnswer = (question: string): string => {
    if (question.toLowerCase().includes("django")) {
      return "Django is a high-level Python web framework that enables rapid development of secure and maintainable websites. Built by experienced developers, Django takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel.";
    } else {
      return "Python is a high-level, interpreted programming language known for its readability and simplicity. It supports multiple programming paradigms, including procedural, object-oriented, and functional programming. Python has a large standard library and vibrant ecosystem, making it suitable for a wide range of applications from web development to data science and AI.";
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={generateAnswer}
      disabled={isLoading || !question.trim()}
      className="flex items-center gap-1"
    >
      <Sparkles className={`h-3.5 w-3.5 ${isLoading ? 'animate-pulse' : ''}`} />
      <span>{isLoading ? "Generating..." : "Generate with AI"}</span>
    </Button>
  );
};

export default AIHelper;
