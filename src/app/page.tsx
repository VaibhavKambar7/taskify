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
import { Spinner } from "@/components/ui/spinner";
import TaskCard from "@/components/TaskCard";

export interface Task {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/get-task");
        if (response.status === 200) {
          setTasks(
            response.data.tasks.map((task: any) => ({
              id: task.slug,
              title: task.title || "Untitled",
              slug: task.slug,
              description: task.description || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
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
      const response = await axios.delete(`/api/delete-task/${slug}`);
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
        {loading ? (
          <div className="flex justify-center items-center h-full mt-20">
            <Spinner className="w-full mt-20" size={40} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center mt-20 justify-center h-full">
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
              <TaskCard key={task.id} task={task} onDelete={deleteTask} />
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
