"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { dummyTasks } from "@/lib/dummy";

export default function CreateTask() {
  const router = useRouter();
  const [newTask, setNewTask] = useState({ title: "", content: "" });

  const handleSave = () => {
    if (newTask.title || newTask.content) {
      const task = {
        id: (dummyTasks?.length + 1).toString(),
        slug: uuidv4(),
        title: newTask.title || "Untitled",
        content: newTask.content,
        completed: false,
      };

      console.log("New Task Created:", task);

      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200 flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-[#2D2E30] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Create New Task
        </h2>
        <Input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Title"
          className="mb-4 bg-[#3C3F42] border-[#5F6368] text-gray-200 placeholder-gray-400"
        />
        <Textarea
          value={newTask.content}
          onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
          placeholder="Content"
          className="mb-4 bg-[#3C3F42] border-[#5F6368] text-gray-200 placeholder-gray-400"
        />
        <Button
          onClick={handleSave}
          className="bg-[#8AB4F8] hover:bg-[#7AA0E4] text-[#202124]"
        >
          Save Task
        </Button>
      </div>
    </div>
  );
}
