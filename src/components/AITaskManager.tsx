import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2 } from 'lucide-react'

export function AITaskManager() {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Complete project proposal", priority: "High", status: "In Progress" },
        { id: 2, title: "Research machine learning algorithms", priority: "Medium", status: "To Do" },
        { id: 3, title: "Prepare presentation slides", priority: "Low", status: "Done" },
    ])
    const [newTask, setNewTask] = useState("")
    const [loading, setLoading] = useState(false)

    const addTask = () => {
        if (newTask.trim() === "") return
        setLoading(true)
        // Simulating AI processing
        setTimeout(() => {
            const newTaskObj = {
                id: tasks.length + 1,
                title: newTask,
                priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
                status: "To Do"
            }
            setTasks([...tasks, newTaskObj])
            setNewTask("")
            setLoading(false)
        }, 1500)
    }

    const removeTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>AI Task Manager</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-2 mb-4">
                    <Input
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <Button onClick={addTask} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </div>
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div>
                                <span className="font-medium">{task.title}</span>
                                <div className="flex space-x-2 mt-1">
                                    <Badge variant="outline">{task.priority}</Badge>
                                    <Badge>{task.status}</Badge>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeTask(task.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

