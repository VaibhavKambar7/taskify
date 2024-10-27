"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { updateProfile } from "./action";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPreviewUrl(session.user.image || "");
    }
  }, [session]);

  const createPreviewUrl = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    createPreviewUrl(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const result = await updateProfile(formData);

      if (result.success) {
        await update({
          user: {
            name: result.user.name,
            image: result.user.image,
          },
        });

        router.refresh();
        router.push("/");
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
      <form onSubmit={onSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div
          className={`relative border-2 ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <Upload className="mx-auto mb-4 text-gray-400" size={24} />
          <p className="text-sm text-gray-600">
            {isLoading
              ? "Updating profile..."
              : "Drag and drop an image here or click to upload"}
          </p>
          <Input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageSelect(e.target.files[0])
            }
            disabled={isLoading}
            className="hidden"
          />
        </div>
        {previewUrl && (
          <div className="mt-4 relative">
            <Image
              src={previewUrl}
              alt="Profile preview"
              layout="responsive"
              width={500}
              height={300}
              className="rounded-lg shadow-sm"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200 rounded-lg" />
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating Profile..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
