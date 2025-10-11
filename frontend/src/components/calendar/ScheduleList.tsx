"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Schedule {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "draft" | "published" | "archived";
  events: number;
  resources: number;
}

interface ScheduleListProps {
  schedules: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (scheduleId: string) => void;
  onPublish?: (scheduleId: string) => void;
  onArchive?: (scheduleId: string) => void;
}

export default function ScheduleList({ schedules, onEdit, onDelete, onPublish, onArchive }: ScheduleListProps) {
  const getStatusColor = (status: Schedule["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {schedules.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No schedules available</p>
          </CardContent>
        </Card>
      ) : (
        schedules.map((schedule) => (
          <Card key={schedule.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{schedule.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                </div>
                <Badge className={getStatusColor(schedule.status)}>
                  {schedule.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="text-sm text-gray-500">
                  <p>Period: {schedule.startDate} - {schedule.endDate}</p>
                  <p>{schedule.events} events • {schedule.resources} resources</p>
                </div>

                <div className="flex justify-end space-x-2">
                  {schedule.status === "draft" && onPublish && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPublish(schedule.id)}
                    >
                      Publish
                    </Button>
                  )}
                  {schedule.status === "published" && onArchive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onArchive(schedule.id)}
                    >
                      Archive
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(schedule)}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(schedule.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}