"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Textarea } from "@/components/ui/textarea";
import { VideoIcon } from "@radix-ui/react-icons";
import { useRef } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl flex items-center justify-center font-mono text-sm lg:flex">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          ThinkedIn: The Social Network for Thinkers
        </h1>
        <Button onClick={handleButtonClick}>
          <VideoIcon className="mr-2 h-4 w-4" /> Upload Media
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*, video/*"
        />
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Add more context to your thoughts
        </h4>
        <Textarea />
      </div>
    </main>
  );
}
