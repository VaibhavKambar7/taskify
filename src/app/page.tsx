"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { FaRegStickyNote } from "react-icons/fa"; // Import an icon

export interface Task {
  id: string;
  title: string;
  slug: string;
  content: string;
  completed: boolean;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/getTask");
        if (response.ok) {
          const data = await response.json();
          setTasks(
            data.tasks.map((task: any) => ({
              id: task.id,
              title: task.title || "Untitled",
              slug: task.slug,
              content: task.description || "",
              completed: task.completed || false,
            }))
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    const taskSlug = uuidv4();
    router.push(`/task/${taskSlug}`);
  };

  const deleteTask = async (slug: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.slug !== slug));

    try {
      const response = await axios.delete(`/api/deleteTask/${slug}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete task");
      }
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center mt-20 justify-center h-full">
            <FaRegStickyNote className="text-6xl text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">
              No Tasks Found
            </h2>
            <p className="text-lg text-gray-500">
              It seems you have no tasks yet; Any notes you create will show up
              here!
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {tasks.map((task) => (
              <Link key={task.id} href={`/task/${task.slug}`}>
                <Card
                  className="bg-white border-gray-300 mb-4 break-inside-avoid"
                  style={{ maxHeight: "300px" }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <h3
                          className={`text-lg font-semibold ${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteTask(task.slug);
                        }}
                        className="h-6 w-6 text-gray-500 hover:text-gray-800"
                      >
                        <MdDelete />
                      </Button>
                    </div>
                    <p
                      className={`text-sm ${
                        task.completed ? "text-gray-500" : "text-gray-700"
                      } whitespace-pre-wrap`}
                    >
                      {task.content.length > 300
                        ? `${task.content.substring(0, 200)}...`
                        : task.content}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Button
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
        onClick={handleAddTask}
        aria-label="Add new task"
      >
        <FaPlus className="h-6 w-6" />
      </Button>
    </div>
  );
}
