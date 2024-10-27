"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MdDelete } from "react-icons/md";
import Link from "next/link";

export interface Task {
  id: string;
  title: string;
  slug: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  onDelete: (slug: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  return (
    <div>
      <Link href={`/task/${task.slug}`}>
        <Card
          className="bg-white border-gray-300 mb-4 break-inside-avoid"
          style={{ maxHeight: "300px" }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <h3 className={`text-lg font-semibold text-gray-800`}>
                  {task.title}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(task.slug);
                }}
                className="h-6 w-6 text-gray-500 hover:text-gray-800"
              >
                <MdDelete />
              </Button>
            </div>
            <p
              className={`text-sm text-gray-700 whitespace-pre-wrap max-h-24 overflow-hidden truncate`}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 5,
              }}
            >
              {task.description.length > 300
                ? `${task.description.substring(0, 200)}...`
                : task.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default TaskCard;
