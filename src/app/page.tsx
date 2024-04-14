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
  GitHubLogoIcon
} from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
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
import FileUpload from "@/components/ui/FileUpload";
import { FileUploader } from "react-drag-drop-files";
import { IconProps } from "@radix-ui/react-icons/dist/types";

export enum SocialMedias {
  Instagram = 'Instagram',
  Discord = 'Discord',
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  Facebook = 'Facebook',
  Reddit = 'Reddit'
}

export type Card = {
  title: SocialMedias,
  description: string,
  content: string,
  footer: string
}

export type ResponseType = Pick<Card, 'description'> & {
  message: string
};
export type SomeSocialMedias = {
  [K in keyof typeof SocialMedias]?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>
};
const SocialMediaIcons: SomeSocialMedias = {
  LinkedIn: LinkedInLogoIcon,
  Discord: DiscordLogoIcon,
  Twitter: TwitterLogoIcon,
  Instagram: InstagramLogoIcon,
}

export default function Home() {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [radioValue, setRadioValue] = useState(0.3); // Default value
  const [temperatureToSend, setTemperatureToSend] = useState<number>(0.0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileTypes = ["JPG", "PNG", "MP4"];  // UPDATE TYPES
  const [generatingLoading, setGeneratingLoading] = useState<boolean>(false);
  
  const [cardsData, setCardsData] = useState<Card[]>( 
    Object.values(SocialMedias).map((cardTitle) => {
      return {
        title: cardTitle,
        description: "This is the first card's description.",
        content: "Content of the first card goes here.",
        footer: "Footer info of the first card.",
      }
    }));

  const logTextareaContent = () => {
    if (textareaRef.current) {
      console.log(textareaRef.current.value); // Access the current textarea value
    }
  };

  const iconMapping: SomeSocialMedias ={ 
    LinkedIn: LinkedInLogoIcon,
    Discord: DiscordLogoIcon,
    Twitter: TwitterLogoIcon,
    Instagram: InstagramLogoIcon,
  };

  /// POST REQUESTS
  const generatePost = async (file: File, context: string, tone: number) => {
    const formData = new FormData();
    setGeneratingLoading(true);
    console.log(file);
    console.log(context);
    console.log(tone);
    formData.append("file", file);
    formData.append("context", textareaRef.current?.value ?? "");
    formData.append("temperature", tone.toString());
    formData.append("context", "\nLinkedIn: Hello Gemini, I am working on creating a LinkedIn post that showcases my recent professional achievements. Attached is a photo of me receiving an award at our annual industry conference. I'd like you to help me draft a post that highlights this achievement, emphasizes the significance of the award within the tech industry, and reflects my gratitude towards my team and the organization. I aim to share my personal growth in this role and inspire my network with the importance of innovation and teamwork. Please ensure the language is professional yet engaging, suitable for a LinkedIn audience. Include a call to action that encourages my network to strive for excellence in their own fields.");
    
    const response = await fetch(
      "https://anonymaskedcoder.pythonanywhere.com/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    /*
      linkedin: {
        description:
        title;
        footer
      }
      twitter: {
        description:
        title;
        footer
      },
      adkjsajkd: {
        description:
        title;
        footer
      },
    */

    if (response.ok) {
      setGeneratingLoading(false);
      const responseData: ResponseType = await response.json();
      // make your edits hear if the stuff isn't showing.
      const lowercaseData = JSON.parse(responseData.description);
      const parsedData = Object.keys(lowercaseData).reduce((acc: {[key: string]: any}, key) => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        acc[capitalizedKey] = lowercaseData[key];
        return acc;
      }, {} as {[key: string]: any});

        setCardsData((prevData) => {
        return prevData.map((card) => {
          if (parsedData[card.title]) {
            return {...card, description: parsedData[card.title].description}
          }
          return card
        })
      })
      console.log(responseData.description); // This will log the text generated by Gemini
      
    } else {
      console.error("Upload failed");
    }
  };


  /// END POST REQUESTS

  const handleGeneratePosts = async () => {
    if (textareaRef.current) {
      const text = textareaRef.current.value;
      console.log("Sending POST request with:", text);
      if (file) {
        await generatePost(file, text, temperatureToSend);
      }
    }
  };

  /// GET requests
  // const getCardContent = async () => {
  //   try {
  //     const response = await fetch("http://127.0.0.1:5000/get_cards");
  //     if (!response.ok) {
  //       throw new Error(`ERROR!!! Status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setCardsData(data);
  //   } catch (error) {
  //     console.error("Failed to fetch data:", error);
  //   }
  // };
  /// END GET REQUESTS


  // when file content changes (after upload, to allow for multiple uploads of 1 file after another)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFile(files[0]); // Set the uploaded file to state
    }
  };

  // when upload button is clicked (trigger file input)
  const handleUploadButtonClick = (file: File) => {
    setFile(file);
  };

  const handleTemperatureChange = (value: string) => {
    const valueMap: Record<string, number> = {
      'Default': 0.0,
      'Creative': 0.5,
      'Experimental': 1.0
    };

    // Convert the value and update state
    const numberValue = valueMap[value] ?? 0.0; // Default to 0.0
    setTemperatureToSend(numberValue);
    console.log(`${value} set to ${numberValue}`);
  };
  
  const [showAnimation, setShowAnimation] = useState(false);
  useEffect(() => {
    if (file) {
      setShowAnimation(true);
    }
  }, [file]);
  

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
                loop={1} // Number of loops, set to 0 for infinite looping
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={60}
                delaySpeed={1000}
              />
            </span>
          </h1>
        </div>
        {!file && (
          <>
            <h1>Please select or drop a file to upload to the AI!</h1>
            <FileUploader
              handleChange={handleUploadButtonClick}
              name="file"
              types={fileTypes}
            />
          </>
        )}

        {/* Subtitle in its own div */}
        {file && showAnimation && (
          <>
            <div className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 confirmation-message slide-up-animation" role="alert">
              <p className="font-bold text-lg">
                Successfully Selected File!
              </p>
            </div>
            <div className="flex justify-center w-full confirmation-message slide-up-animation">
              <h4 className="text-xl font-semibold tracking-tight">
                Select your tone:
              </h4>
            </div>
            <div className="flex justify-center w-full confirmation-message slide-up-animation2">
              <RadioGroup
                defaultValue="Default"
                onValueChange={handleTemperatureChange} // Directly set the temperatureToSend state
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Default" id="r1" />
                  <Label htmlFor="r1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Creative" id="r2" />
                  <Label htmlFor="r2">Creative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Experimental" id="r3" />
                  <Label htmlFor="r3">Experimental</Label>
                </div>
              </RadioGroup>
            </div>
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
          <div className="flex justify-center w-full confirmation-message slide-up-animation">
            <h4 className="text-xl font-semibold tracking-tight">
              Add more context to your thoughts
            </h4>
          </div>
          {/* Textarea in its own div */}
          <div className="flex justify-center w-full confirmation-message slide-up-animation">
            <Textarea
              ref={textareaRef}
              className="text-lg p-4 w-full h-24 border-2 border-gray-300 rounded-md resize-none"
              placeholder="Type context..."
            />
          </div>
          {/* Button in its own div */}
          <div className="flex justify-center w-full confirmation-message slide-up-animation ">
            <Button onClick={handleGeneratePosts} disabled={generatingLoading}>
              <MagicWandIcon className="mr-2 h-4 w-4" /> 
              <p>{generatingLoading ? 'Loading...' : "Generate Posts"}</p>
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 justify-center confirmation-message slide-up-animation">
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
                      {SocialMediaIcons[card.title] ? 
                        React.createElement(
                          SocialMediaIcons[card.title]!,
                          { className: "w-6 h-6" }
                        ) : null
                      }
                    </div>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  {/* <CardContent>
                    <p>{card.content}</p>
                  </CardContent>
                  <CardFooter>
                    <p>{card.footer}</p>
                  </CardFooter> */}
                </Card>
              </div>
            ))}
          </div>
          </>
          )}
      </div>
    </main>
  );
}

//Commented out code:
//{
/* Card in its own div */
//}
//{
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
//}
//{
/* </div> */
//}
