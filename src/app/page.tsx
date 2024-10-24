"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FaPlus, FaTimes } from "react-icons/fa";
import { dummyTasks } from "@/lib/dummy";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export interface Task {
  id: string;
  title: string;
  slug: string;
  content: string;
  completed: boolean;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);

  const handleAddTask = () => {
    const taskSlug = uuidv4();
    // const task: Task = {
    //   id: (tasks.length + 1).toString(),
    //   title: "Untitled",
    //   slug: taskSlug,
    //   content: "",
    //   completed: false,
    // };

    // setTasks([task, ...tasks]);
    router.push(`/task/${taskSlug}`);
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
          <h1 className="text-2xl font-bold text-gray-200">Taskify</h1>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/assets/pfp.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {tasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.slug}`}>
              <Card
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
            </Link>
          ))}
        </div>
      </main>

      <Button
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-[#8AB4F8] hover:bg-[#7AA0E4] text-[#202124]"
        onClick={handleAddTask}
        aria-label="Add new task"
      >
        <FaPlus className="h-6 w-6" />
      </Button>
    </div>
  );
}
