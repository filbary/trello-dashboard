'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTrigger,
    AlertDialogAction,
    AlertDialogDescription,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Clock, Pause, Play, RefreshCw } from 'lucide-react';

export default function TimerPopover() {
    const [timeInMinutes, setTimeInMinutes] = useState<number | null>(null); // Default to no time set
    const [remainingTime, setRemainingTime] = useState<number | null>(null); // Null when timer isn't active
    const [isPaused, setIsPaused] = useState<boolean>(false); // Pause state
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Timer logic
    useEffect(() => {
        if (remainingTime === null || isPaused) return;

        if (remainingTime <= 0) {
            setIsAlertOpen(true);
            setRemainingTime(null);
        } else {
            const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [remainingTime, isPaused]);

    // Time formatting helper
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Dynamic styles
    const getBorderColor = () => {
        if (timeInMinutes === null) return 'border-gray-800 hover:border-gray-700 text-gray-300';
        if (timeInMinutes <= 10) return 'border-red-500 text-red-500';
        if (timeInMinutes <= 30) return 'border-yellow-500 text-yellow-500';
        return 'border-green-500 text-green-500';
    };

    const getText = () => {
        if (remainingTime !== null) return `Remaining: ${formatTime(remainingTime)}`;
        if (timeInMinutes !== null) return `${timeInMinutes} min`;
        return 'Set Timer';
    };

    const startNewTimer = () => {
        if (timeInMinutes !== null) {
            setRemainingTime(timeInMinutes * 60); // Start new timer
            setIsPaused(false); // Ensure timer isn't paused
            setPopoverOpen(false); // Close popover
        }
    };

    return (
        <>
            {/* Timer Button with Popover */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        className={`border-2 ${getBorderColor()} hover:border-foreground hover:text-foreground transition-all`}
                        variant="outline"
                    >
                        {getText()}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Set Timer</h3>
                        <Slider
                            defaultValue={[timeInMinutes || 5]}
                            min={1}
                            max={60}
                            step={1}
                            onValueChange={(value) => setTimeInMinutes(value[0])}
                        />
                        <p className="text-sm text-muted-foreground">
                            Time: {timeInMinutes ? `${timeInMinutes} minutes` : 'Not Set'}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={startNewTimer}
                                className="flex-1"
                                disabled={timeInMinutes === null}
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Start Timer
                            </Button>
                            {remainingTime !== null && (
                                <Button
                                    onClick={() => setIsPaused(!isPaused)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    {isPaused ? (
                                        <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Resume
                                        </>
                                    ) : (
                                        <>
                                            <Pause className="mr-2 h-4 w-4" />
                                            Pause
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex items-center space-x-2">
                            <Clock className="text-foreground" size={20} />
                            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription>
                            Your timer for {timeInMinutes} minutes has finished.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Okay</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}