"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon, PencilIcon } from "lucide-react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  slug: string;
}

interface TaskForm {
  title: string;
  description: string;
}

export default function TaskPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<TaskForm>({
    title: "",
    description: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enhancedDescription, setEnhancedDescription] = useState("");

  const handleEnhanceDescription = async () => {
    if (!task.description.trim()) {
      toast.error("Description is required for enhancement");
      return;
    }

    setIsPending(true);

    try {
      const response = await axios.post("/api/enhance-description", {
        description: task.description,
      });

      if (response.data.enhancedDescription) {
        setEnhancedDescription(response.data.enhancedDescription);
        setIsDialogOpen(true);
      } else if (response.data.error) {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error("Error enhancing description");
    } finally {
      setIsPending(false);
    }
  };

  const handleConfirmEnhancement = (finalText: string) => {
    setTask((prev) => ({
      ...prev,
      description: finalText,
    }));
    setIsDialogOpen(false);
    toast.success("Description updated successfully");
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  useEffect(() => {
    const fetchTask = async () => {
      if (!params.slug) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/get-task/${params.slug}`);
        const fetchedTasks = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setTasks(fetchedTasks);

        if (fetchedTasks.length > 0) {
          setTask({
            title: fetchedTasks[0].title,
            description: fetchedTasks[0].description || "",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          setTask({
            title: "",
            description: "",
          });
          setTasks([]);
        } else {
          toast.error("You must be logged in to manage tasks");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [params.slug, router]);

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const handleSubmit = async () => {
    if (!session) {
      toast.error("You must be logged in to manage tasks");
      return;
    }

    if (!task.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        title: task.title.trim(),
        description: task.description.trim() || null,
      };

      if (params.slug && tasks.length > 0) {
        await axios.put(`/api/edit-task/${params.slug}`, taskData);
        toast.success("Task updated successfully");
      } else {
        await axios.post("/api/create-task", taskData);
        toast.success("Task created successfully");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{
        error: string;
        message?: string;
        details?: any;
      }>;

      if (axiosError.response?.status === 401) {
        router.push("/auth/login");
        return;
      }

      toast.error("Failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-gray-800 flex items-center justify-center">
        <Spinner className="w-full" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {tasks.length > 0 ? "Edit Task" : "Create New Task"}
        </h2>

        {tasks.length > 1 && (
          <div className="mb-4 text-yellow-600 bg-yellow-100 p-3 rounded">
            Warning: Multiple tasks found with this slug. Editing the first
            task.
          </div>
        )}
        <Input
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="Title"
          className="mb-4 bg-white border-gray-300 text-gray-800 placeholder-gray-400 h-10 text-lg"
          disabled={isSubmitting}
        />
        <div className="relative mb-6">
          <Textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            placeholder="Description (optional)"
            className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 h-40 text-md "
            disabled={isSubmitting}
          />
          {isPending ? (
            <Spinner
              className="ml-2 absolute top-3 text-gray-500 right-6"
              size={20}
            />
          ) : (
            <FaWandMagicSparkles
              onClick={handleEnhanceDescription}
              className="absolute top-3  text-gray-500 right-6 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-blue-500"
            />
          )}
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white h-10 w-full px-4 text-md flex items-center justify-center"
          disabled={isSubmitting || status === "loading"}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-1" size={20} />
              Saving
            </>
          ) : (
            <>
              {tasks.length > 0 ? (
                <PencilIcon className="h-6 w-6 ml-1" />
              ) : (
                <PlusIcon className="h-6 w-6 ml-1" />
              )}
              {tasks.length > 0 ? "Edit Task" : "Create Task"}
            </>
          )}
        </Button>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        originalText={task.description}
        enhancedText={enhancedDescription}
        onConfirm={handleConfirmEnhancement}
      />
    </div>
  );
}
