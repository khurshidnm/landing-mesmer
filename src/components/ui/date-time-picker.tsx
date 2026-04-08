"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  getYear,
  isSameDay,
  isSameMonth,
  setHours,
  setMinutes,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDateTimeLocal, parseDateTimeLocal } from "@/lib/datetime-local";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: index.toString(),
  label: format(new Date(2026, index, 1), "MMMM"),
}));

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(
    () => parseDateTimeLocal(value) ?? new Date(),
    [value]
  );
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [timeValue, setTimeValue] = useState(format(selectedDate, "HH:mm"));
  const yearOptions = useMemo(() => {
    const centerYear = getYear(selectedDate);
    return Array.from({ length: 15 }, (_, index) => centerYear - 7 + index);
  }, [selectedDate]);

  useEffect(() => {
    setCurrentMonth(startOfMonth(selectedDate));
    setTimeValue(format(selectedDate, "HH:mm"));
  }, [selectedDate]);

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days: Date[] = [];

    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push(day);
    }

    return days;
  }, [currentMonth]);

  const updateValue = (nextDate: Date) => {
    onChange(formatDateTimeLocal(nextDate));
  };

  const handleDateSelect = (day: Date) => {
    const nextDate = new Date(selectedDate);
    nextDate.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    updateValue(nextDate);
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth((prev) => setMonth(prev, Number(month)));
  };

  const handleYearChange = (year: string) => {
    setCurrentMonth((prev) => setYear(prev, Number(year)));
  };

  const handleTimeChange = (nextTime: string) => {
    setTimeValue(nextTime);

    const [hours, minutes] = nextTime.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }

    const nextDate = new Date(selectedDate);
    nextDate.setHours(hours, minutes, 0, 0);
    updateValue(nextDate);
  };

  const handleQuickDate = (mode: "today" | "now") => {
    if (mode === "now") {
      updateValue(new Date());
      return;
    }

    const today = new Date();
    const nextDate = new Date(selectedDate);
    nextDate.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
    updateValue(nextDate);
  };

  const handleQuickTime = (hours: number, minutes: number) => {
    const nextDate = setMinutes(setHours(new Date(selectedDate), hours), minutes);
    setTimeValue(format(nextDate, "HH:mm"));
    updateValue(nextDate);
  };

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-auto w-full justify-between px-4 py-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <div className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Publication date
              </span>
              <span className="text-sm font-medium">
                {value ? format(selectedDate, "dd MMM yyyy, HH:mm") : "Select date"}
              </span>
            </div>
            <CalendarDays className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[360px] p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">Pick date and time</div>
                <div className="text-xs text-muted-foreground">
                  Fast set for news publish time
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickDate("today")}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickDate("now")}
                >
                  Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_120px] gap-2">
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
              {weekDays.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 rounded-lg border p-2">
              {calendarDays.map((day) => (
                <Button
                  key={day.toISOString()}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "h-10 w-10 rounded-md p-0 text-sm",
                    !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50",
                    isSameDay(day, selectedDate) &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  )}
                  onClick={() => handleDateSelect(day)}
                >
                  {format(day, "d")}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Time</span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickTime(9, 0)}
                  >
                    09:00
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickTime(12, 0)}
                  >
                    12:00
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickTime(18, 0)}
                  >
                    18:00
                  </Button>
                </div>
              </div>
              <Input
                type="time"
                value={timeValue}
                disabled={disabled}
                onChange={(e) => handleTimeChange(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Selected
                </div>
                <div className="text-sm font-medium">
                  {format(selectedDate, "dd MMM yyyy, HH:mm")}
                </div>
              </div>
              <Button type="button" size="sm" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
