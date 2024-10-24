"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FaPlus, FaTimes } from "react-icons/fa";
import { dummyTasks } from "@/lib/dummy";

export interface Task {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", content: "" });

  const addNewTask = () => {
    if (newTask.title || newTask.content) {
      const task: Task = {
        id: (tasks.length + 1).toString(),
        title: newTask.title || "Untitled",
        content: newTask.content,
        completed: false,
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: "", content: "" });
    }
    setIsAddingTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      <header className="bg-[#202124] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-200">Taskify </h1>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/assets/pfp.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {isAddingTask && (
            <Card className="bg-[#2D2E30] border-[#5F6368] mb-4 break-inside-avoid">
              <CardContent className="p-4">
                <Input
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="bg-[#2D2E30] border-[#5F6368] text-gray-200 placeholder-gray-400 mb-2"
                />
                <Textarea
                  placeholder="Content"
                  value={newTask.content}
                  onChange={(e) =>
                    setNewTask({ ...newTask, content: e.target.value })
                  }
                  className="bg-[#2D2E30] border-[#5F6368] text-gray-200 placeholder-gray-400 mb-2"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={addNewTask}
                    className="bg-[#8AB4F8] hover:bg-[#7AA0E4] text-[#202124]"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-[#2D2E30] border-[#5F6368] mb-4 break-inside-avoid"
              style={{ maxHeight: "300px" }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mr-2"
                    />
                    <h3
                      className={`text-lg font-semibold ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-200"
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-6 w-6 text-gray-400 hover:text-gray-200"
                  >
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </div>
                <p
                  className={`text-sm ${
                    task.completed ? "text-gray-500" : "text-gray-300"
                  } whitespace-pre-wrap`}
                >
                  {task.content.length > 300
                    ? `${task.content.substring(0, 400)}...`
                    : task.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Button
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-[#8AB4F8] hover:bg-[#7AA0E4] text-[#202124]"
        onClick={() => setIsAddingTask(true)}
        aria-label="Add new task"
      >
        <FaPlus className="h-6 w-6" />
      </Button>
    </div>
  );
}
