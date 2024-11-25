'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks, Task } from '../hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function TaskList() {
    const { tasks, loading, error, hasMore, addTask, updateTask, deleteTask, loadMore } = useTasks();
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);

    useEffect(() => {
        setDisplayedTasks(tasks);
    }, [tasks]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addTask(newTask.title, newTask.description);
            setNewTask({ title: '', description: '' });
            setIsAddingTask(false);
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    };

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTask) {
            try {
                await updateTask(editingTask.id, editingTask.title, editingTask.description);
                setEditingTask(null);
            } catch (err) {
                console.error('Failed to update task:', err);
            }
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    const handleLoadMore = () => {
        loadMore();
    };

    const filteredTasks = displayedTasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (isAddingTask) {
            document.getElementById('newTaskTitle')?.focus();
        }
    }, [isAddingTask]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
                <Button onClick={() => setIsAddingTask(true)} className="w-full sm:w-auto">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Task
                </Button>
            </div>

            <AnimatePresence>
                {isAddingTask && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <form onSubmit={handleAddTask} className="space-y-4 p-4">
                                <Input
                                    id="newTaskTitle"
                                    type="text"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    placeholder="Task title"
                                    required
                                />
                                <Textarea
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    placeholder="Task description"
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button type="submit">Add Task</Button>
                                    <Button type="button" variant="outline" onClick={() => setIsAddingTask(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                    {filteredTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{task.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                </CardContent>
                                <CardFooter className="justify-end space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => setEditingTask(task)}>
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(task.id)}>
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {editingTask && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                    >
                        <Card className="w-full max-w-md">
                            <form onSubmit={handleUpdateTask} className="space-y-4 p-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Edit Task</h3>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingTask(null)}>
                                        <XMarkIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                                <Input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                    placeholder="Task title"
                                    required
                                />
                                <Textarea
                                    value={editingTask.description}
                                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                    placeholder="Task description"
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button type="submit">Update Task</Button>
                                    <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {hasMore && (
                <div className="text-center mt-8">
                    <Button onClick={handleLoadMore} disabled={loading} size="lg">
                        {loading ? 'Loading...' : 'Load More Tasks'}
                    </Button>
                </div>
            )}
        </div>
    );
}

