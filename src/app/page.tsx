"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  VideoIcon,
  MagicWandIcon,
  LinkedInLogoIcon,
  DiscordLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
} from "@radix-ui/react-icons";
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
import { Typewriter } from "nextjs-simple-typewriter";
import React from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCards, setShowCards] = useState(false);
  const [cardsData, setCardsData] = useState([
    {
      title: "LinkedIn",
      description: "This is the first card's description.",
      content: "Content of the first card goes here.",
      footer: "Footer info of the first card.",
    },
    {
      title: "Twitter",
      description: "This is the second card's description.",
      content: "Content of the second card goes here.",
      footer: "Footer info of the second card.",
    },
    {
      title: "Instagram",
      description: "This is the third card's description.",
      content: "Content of the third card goes here.",
      footer: "Footer info of the third card.",
    },
    {
      title: "Discord",
      description: "This is the third card's description.",
      content: "Content of the third card goes here.",
      footer: "Footer info of the third card.",
    },
    {
      title: "Instagram",
      description: "This is the third card's description.",
      content: "Content of the third card goes here.",
      footer: "Footer info of the third card.",
    },
    {
      title: "Instagram",
      description: "This is the third card's description.",
      content: "Content of the third card goes here.",
      footer: "Footer info of the third card.",
    },
  ]);
  const [radioValue, setRadioValue] = useState(0.5); // Default value
  const [contextText, setContextText] = useState("");
  const [temperatureToSend, setTemperatureToSend] = useState("default");
  const iconMapping = {
    LinkedIn: LinkedInLogoIcon,
    Discord: DiscordLogoIcon,
    Twitter: TwitterLogoIcon,
    Instagram: InstagramLogoIcon,
  };

  // POST REQUEST
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current!.click();
  };
  // END POST REQUESTs

  // GET requests
  const handleGeneratePosts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/post_generation");
      if (!response.ok) {
        throw new Error(`ERROR!!! Status: ${response.status}`);
      }
      const data = await response.json();
      setCardsData(data);
      setShowCards(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  // END REQUESTs

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 py-16">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center space-y-6">
        {/* Title in its own div */}
        <div className="flex justify-center w-full">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-4.5xl">
            ThinkedIn: The Social Network for {""}
            <span style={{ color: "purple", fontWeight: "bold" }}>
              <Typewriter
                words={["Thinkers", "Creators", "Innovators", "Dreamers"]}
                loop={0} // Number of loops, set to 0 for infinite looping
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={60}
                delaySpeed={1000}
              />
            </span>
          </h1>
        </div>
        {/* Button in its own div */}
        <div className="flex justify-center w-full">
          <Button onClick={handleUploadButtonClick}>
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
          <RadioGroup
            value={temperatureToSend} // This ensures the RadioGroup is a controlled component
            onValueChange={setTemperatureToSend} // Directly set the temperatureToSend state
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Creative</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Experimental</Label>
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
            className="text-lg p-4 w-full h-24 border-2 border-gray-300 rounded-md resize-none"
            placeholder="Type context..."
          />
        </div>
        {/* Button in its own div */}
        <div className="flex justify-center w-full">
          <Button onClick={handleGeneratePosts}>
            <MagicWandIcon className="mr-2 h-4 w-4" /> Generate Posts
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Dynamic rendering of cards, assuming cardsData is an array of card info */}
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="w-full w-[16rem] md:w-[20rem] h-[18rem] flex flex-row flex-wrap gap-12 justify-between"
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-row items-center gap-2">
                    <CardTitle>{card.title}</CardTitle>
                    {iconMapping[card.title as keyof typeof iconMapping]
                      ? React.createElement(
                          iconMapping[card.title as keyof typeof iconMapping],
                          { className: "w-6 h-6" }
                        )
                      : null}
                  </div>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{card.content}</p>
                </CardContent>
                <CardFooter>
                  <p>{card.footer}</p>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

//Commented out code:
{
  /* Card in its own div */
}
{
  /* <div className="flex flex-row flex-wrap gap-12">
          <div className="w-[18rem] h-[18rem]">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
          <div className="w-[18rem] h-[18rem]">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
          <div className="w-[18rem] h-[18rem]">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div> */
}
{
  /* </div> */
}
