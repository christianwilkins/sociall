"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCards, setShowCards] = useState(false);
  const [cardsData, setCardsData] = useState([]);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current!.click();
  };


  const handleGeneratePosts = async () => {
    // GET request
    try {
      const response = await fetch("http://localhost:3000/post_generation"); 
      if (!response.ok) {
        throw new Error(`ERROR!!! Status: ${response.status}`);
      }
      const data = await response.json();
      setShowCards(true);
      setShowCards(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center space-y-6">
        {/* Title in its own div */}
        <div className="flex justify-center w-full">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            ThinkedIn: The Social Network for Thinkers
          </h1>
        </div>
        {/* Button in its own div */}
        <div className="flex justify-center w-full">
          <Button onClick={handleButtonClick}>
            <VideoIcon className="mr-2 h-4 w-4" /> Upload Media
          </Button>
        </div>
        {/* Subtitle in its own div */}
        <div className="flex justify-center w-full">
          <h4 className="text-xl font-semibold tracking-tight">
            Select your tone
          </h4>
        </div>
        {/* Radio buttons in its own div */}
        <div className="flex justify-center w-full">
          <RadioGroup defaultValue="default">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creative" id="creative" />
              <Label htmlFor="creative">Creative</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="experimental" id="experimental" />
              <Label htmlFor="experimental">Experimental</Label>
            </div>
          </RadioGroup>
        </div>
        {/* File input hidden, not in a visible div, but encapsulated for structure */}
        <div className="w-full">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*, video/*"
            onChange={handleFileChange}
          />
        </div>
        {/* Subtitle in its own div */}
        <div className="flex justify-center w-full">
          <h4 className="text-xl font-semibold tracking-tight">
            Add more context to your thoughts
          </h4>
        </div>
        {/* Textarea in its own div */}
        <div className="flex justify-center w-full">
          <Textarea
            className="text-lg p-4 w-full h-48 border-2 border-gray-300 rounded-md resize-none"
            placeholder="Type context..."
          />
        </div>
        {/* Button in its own div */}
        <div className="flex justify-center w-full">
          <Button>
            <MagicWandIcon className="mr-2 h-4 w-4" /> Generate Posts
          </Button>
        </div>
      </div>
    </main>
  );
}
