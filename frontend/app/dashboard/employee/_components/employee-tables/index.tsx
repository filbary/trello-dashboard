'use client';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { columns } from '../employee-tables/columns';
import { useEmployeeTableFilters } from './use-employee-table-filters';
import {ListWithCards, User} from "@/app/types";
import {getUsersCardCount} from "@/app/dashboard/overview/_components/metrics/utils";
import React from "react";

export default function EmployeeTable({data, totalData, listsWithCards, actionCounts}: {
    data: User[];
    totalData: number;
    listsWithCards: ListWithCards[];
    actionCounts: Record<string, number>;
}) {
    const {
        isAnyFilterActive,
        resetFilters,
    } = useEmployeeTableFilters();

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
                <DataTableResetFilter
                    isFilterActive={isAnyFilterActive}
                    onReset={resetFilters}
                />
            </div>
            <DataTable
                columns={columns}
                data={data.map((user) => ({
                    ...user,
                    tasksCount: getUsersCardCount(user, listsWithCards),
                    actionsCount: actionCounts[user.id] || 0,
                }))}
                totalItems={totalData}
            />
        </div>
    );
}