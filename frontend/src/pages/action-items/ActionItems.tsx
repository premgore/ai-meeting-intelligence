import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  Filter,
} from "lucide-react";
import meetingService from "../../services/meetingService";
import { Card } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import { Skeleton } from "../../components/ui/Skeleton";

interface ExtractedActionItem {
  id: string;
  task: string;
  meetingId: number;
  meetingTitle: string;
  owner: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  createdAt?: string | null;
}

export const ActionItems: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  });

  // Extract action items from backend meetings data with state tracking
  const allActionItems: ExtractedActionItem[] = meetings.flatMap((meeting) => {
    const rawItems = meeting.action_items || [];
    return rawItems.map((itemStr, iIdx) => {
      const isCompleted = iIdx % 3 === 2;
      const isInProgress = iIdx % 3 === 1;
      const status = isCompleted ? "Completed" : isInProgress ? "In Progress" : "Pending";
      const priority = iIdx % 3 === 0 ? "High" : iIdx % 3 === 1 ? "Medium" : "Low";

      return {
        id: `${meeting.id}-${iIdx}`,
        task: itemStr,
        meetingId: meeting.id,
        meetingTitle: meeting.title,
        owner: iIdx % 2 === 0 ? "Engineering Lead" : "Product Manager",
        dueDate: "Next Sprint",
        priority,
        status,
        createdAt: meeting.created_at,
      };
    });
  });

  // Local state toggling for interactive demo feel
  const [itemsList, setItemsList] = useState<ExtractedActionItem[]>([]);
  
  React.useEffect(() => {
    if (allActionItems.length > 0 && itemsList.length === 0) {
      setItemsList(allActionItems);
    }
  }, [meetings]);

  const displayedItems = (itemsList.length > 0 ? itemsList : allActionItems).filter((item) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && item.status === "Pending") ||
      (activeTab === "in_progress" && item.status === "In Progress") ||
      (activeTab === "completed" && item.status === "Completed");

    const matchesSearch =
      item.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setItemsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === "Pending"
              ? "In Progress"
              : item.status === "In Progress"
              ? "Completed"
              : "Pending";
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const tabs = [
    { id: "all", label: "All Items", badge: allActionItems.length },
    {
      id: "pending",
      label: "Pending",
      badge: allActionItems.filter((i) => i.status === "Pending").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      badge: allActionItems.filter((i) => i.status === "In Progress").length,
    },
    {
      id: "completed",
      label: "Completed",
      badge: allActionItems.filter((i) => i.status === "Completed").length,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E8E1D8] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#211F1D]">
            Action Items Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#6F6A65] mt-1">
            Executive command-center view of all tasks generated across your meetings.
          </p>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="relative w-full sm:w-64">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6F6A65]" />
          <input
            type="text"
            placeholder="Filter tasks or owners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#E8E1D8] bg-white text-xs text-[#211F1D] focus:outline-none focus:border-[#7A171C]"
          />
        </div>
      </div>

      {/* Task List Table / Cards */}
      <Card className="bg-white border-[#E8E1D8]">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CheckSquare size={38} className="mx-auto text-[#A39D97]" />
            <p className="text-xs text-[#6F6A65]">No action items found matching your criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E1D8]">
            {displayedItems.map((item) => {
              const isDone = item.status === "Completed";
              return (
                <div
                  key={item.id}
                  className="p-4 hover:bg-[#FAF8F4] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className="mt-0.5 text-[#7A171C] hover:text-[#C9953E] transition-colors cursor-pointer"
                      title="Click to change status"
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald-700 fill-emerald-100" />
                      ) : (
                        <CheckSquare size={18} className="text-[#7A171C]" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-bold text-[#211F1D] ${
                          isDone ? "line-through text-[#6F6A65]" : ""
                        }`}
                      >
                        {item.task}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6F6A65]">
                        <button
                          onClick={() => navigate(`/meetings/${item.meetingId}`)}
                          className="font-bold text-[#7A171C] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {item.meetingTitle} <ChevronRight size={12} />
                        </button>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User size={12} /> {item.owner}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Badge
                      variant={
                        item.priority === "High"
                          ? "high"
                          : item.priority === "Medium"
                          ? "medium"
                          : "low"
                      }
                      className="text-[10px]"
                    >
                      {item.priority} Priority
                    </Badge>

                    <button
                      onClick={() => toggleStatus(item.id)}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant={
                          item.status === "Completed"
                            ? "success"
                            : item.status === "In Progress"
                            ? "warning"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {item.status}
                      </Badge>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActionItems;
