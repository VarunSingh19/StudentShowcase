'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks, Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { generateProjectPlan } from '@/lib/gemini-ai';

export default function TaskListPage() {
    const { tasks, loading, error, hasMore, addTask, updateTask, deleteTask, loadMore } = useTasks();
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editingProjectPlan, setEditingProjectPlan] = useState<{
        taskId: string | null;
        technicalRequirements: string[];
        developmentPhases: string[];
        featuresList: string[];
        deploymentSteps: string[];
        githubRepositories: string[];
        resourceLinks: string[];
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [generatingPlan, setGeneratingPlan] = useState<string | null>(null);

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
                await updateTask(editingTask.id, editingTask.title, editingTask.description, editingTask.projectPlan);
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

    const handleGenerateProjectPlan = async (task: Task) => {
        setGeneratingPlan(task.id);
        try {
            const plan = await generateProjectPlan(task.title);
            await updateTask(task.id, task.title, task.description, plan);
            setGeneratingPlan(null);
        } catch (error) {
            console.error('Failed to generate project plan:', error);
            setGeneratingPlan(null);
        }
    };

    const handleSaveProjectPlan = async () => {
        if (editingProjectPlan && editingProjectPlan.taskId) {
            const task = tasks.find(t => t.id === editingProjectPlan.taskId);
            if (task) {
                try {
                    await updateTask(task.id, task.title, task.description, {
                        technicalRequirements: editingProjectPlan.technicalRequirements,
                        developmentPhases: editingProjectPlan.developmentPhases,
                        featuresList: editingProjectPlan.featuresList,
                        deploymentSteps: editingProjectPlan.deploymentSteps,
                        githubRepositories: editingProjectPlan.githubRepositories,
                        resourceLinks: editingProjectPlan.resourceLinks
                    });
                    setEditingProjectPlan(null);
                } catch (err) {
                    console.error('Failed to update project plan:', err);
                }
            }
        }
    };

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (isAddingTask) {
            document.getElementById('newTaskTitle')?.focus();
        }
    }, [isAddingTask]);

    const renderProjectPlanContent = (task: Task) => {
        // If we're editing this specific task's project plan
        if (editingProjectPlan && editingProjectPlan.taskId === task.id) {
            return (
                <div className="space-y-6">
                    {(['technicalRequirements', 'developmentPhases', 'featuresList', 'deploymentSteps', 'githubRepositories', 'resourceLinks'] as const).map((section) => (
                        <div key={section}>
                            <h4 className="font-semibold mb-2 capitalize">
                                {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </h4>
                            <div className="space-y-2">
                                {editingProjectPlan[section].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => {
                                                const updatedSection = [...editingProjectPlan[section]];
                                                updatedSection[index] = e.target.value;
                                                setEditingProjectPlan(prev => prev ? {
                                                    ...prev,
                                                    [section]: updatedSection
                                                } : null);
                                            }}
                                            className="flex-grow"
                                        />
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                const updatedSection = editingProjectPlan[section].filter((_, i) => i !== index);
                                                setEditingProjectPlan(prev => prev ? {
                                                    ...prev,
                                                    [section]: updatedSection
                                                } : null);
                                            }}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingProjectPlan(prev => prev ? {
                                            ...prev,
                                            [section]: [...prev[section], '']
                                        } : null);
                                    }}
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" /> Add {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end space-x-2">
                        <Button onClick={handleSaveProjectPlan}>
                            <CheckIcon className="h-4 w-4 mr-2" /> Save Changes
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setEditingProjectPlan(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            );
        }

        // Normal view of project plan
        if (!task.projectPlan) return null;

        return (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Technical Requirements:</h4>
                    <ul className="list-disc pl-5">
                        {task.projectPlan.technicalRequirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Development Phases:</h4>
                    <ul className="list-disc pl-5">
                        {task.projectPlan.developmentPhases.map((phase, index) => (
                            <li key={index}>{phase}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Features List:</h4>
                    <ul className="list-disc pl-5">
                        {task.projectPlan.featuresList.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Deployment Steps:</h4>
                    <ul className="list-disc pl-5">
                        {task.projectPlan.deploymentSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Similar GitHub Repositories:</h4>
                    <ul className="list-disc pl-5">
                        {task.projectPlan.githubRepositories.map((repo, index) => (
                            <li key={index}>
                                <a href={repo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {repo}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold">Resource Links:</h4>
                    <ul className="list-disc pl-5">
                        {task.projectPlan.resourceLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                {task.projectPlan && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                if (task.projectPlan) {
                                    setEditingProjectPlan({
                                        taskId: task.id,
                                        technicalRequirements: task.projectPlan.technicalRequirements,
                                        developmentPhases: task.projectPlan.developmentPhases,
                                        featuresList: task.projectPlan.featuresList,
                                        deploymentSteps: task.projectPlan.deploymentSteps,
                                        githubRepositories: task.projectPlan.githubRepositories,
                                        resourceLinks: task.projectPlan.resourceLinks
                                    });
                                }
                            }}
                        >
                            <PencilIcon className="h-4 w-4 mr-2" /> Edit Plan
                        </Button>
                    </div>
                )}
            </div>
        );
    };



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
                                    <Button
                                        className="mt-4"
                                        onClick={() => handleGenerateProjectPlan(task)}
                                        disabled={generatingPlan === task.id}
                                    >
                                        {generatingPlan === task.id ? 'Generating...' : 'StudentShowcaseAI'}
                                    </Button>
                                    {task.projectPlan && (
                                        <Accordion type="single" collapsible className="mt-4">
                                            <AccordionItem value="plan">
                                                <AccordionTrigger>View Project Plan</AccordionTrigger>
                                                <AccordionContent>
                                                    {renderProjectPlanContent(task)}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    )}
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
                    <Button onClick={loadMore} disabled={loading} size="lg">
                        {loading ? 'Loading...' : 'Load More Tasks'}
                    </Button>
                </div>
            )}
        </div>
    );
}