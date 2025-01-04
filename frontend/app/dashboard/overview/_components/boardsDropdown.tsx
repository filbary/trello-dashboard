import React, { useState, useEffect, useMemo } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Board = {
    id: string;
    name: string;
};

type DropdownProps = {
    boards: Board[] | null;
    onSelect?: (board: Board) => void;
    isLoading?: boolean;
};

const BoardDropdown: React.FC<DropdownProps> = ({ boards, onSelect, isLoading }) => {
    const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

    // Set the default board to the first one in the list when boards change
    useEffect(() => {
        if (boards && boards.length > 0) {
            setSelectedBoard((prev) => prev || boards[0]);
        }
    }, [boards]);

    const handleSelect = (board: Board) => {
        setSelectedBoard(board); // Update the selected board
        onSelect?.(board); // Notify the parent component
    };

    const renderedBoards = useMemo(() => {
        if (!boards || boards.length === 0) {
            return <div className="px-3 py-2 text-sm text-surface-muted">No boards available</div>;
        }
        return boards.map((board) => (
            <DropdownMenuPrimitive.Item
                key={board.id}
                className={cn(
                    'px-3 py-2 text-sm rounded-md cursor-pointer select-none transition-colors',
                    selectedBoard?.id === board.id
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground focus:outline-none'
                )}
                onClick={() => handleSelect(board)}
            >
                {board.name}
            </DropdownMenuPrimitive.Item>
        ));
    }, [boards, selectedBoard]);

    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger
                className={cn(
                    'flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md shadow-md',
                    'bg-primary text-primary-foreground border border-primary/20',
                    'hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : selectedBoard ? (
                    selectedBoard.name
                ) : (
                    'No boards available'
                )}
                <ChevronDownIcon className="ml-2 h-4 w-4 text-primary-foreground" />
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                    className={cn(
                        'min-w-[12rem] p-2 rounded-md shadow-lg z-50',
                        'bg-surface text-surface-foreground border border-surface-border',
                        'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out bg-opacity-100'
                    )}
                    style={{ backgroundColor: 'var(--dropdown-bg, #fff)' }}
                    sideOffset={4}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-surface-muted" />
                        </div>
                    ) : (
                        renderedBoards
                    )}
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
};

export default BoardDropdown;
