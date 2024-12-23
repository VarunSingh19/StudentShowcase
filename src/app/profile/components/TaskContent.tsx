import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TaskListPage from '@/app/tasklist/TaskListPage'

export function TasksContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
                <CardDescription>
                    Manage your Tasks here
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TaskListPage />
            </CardContent>
        </Card>
    )
}

