// src/components/Dashboard.tsx
import { useState, useEffect } from "react";
import { getTasks } from "../api/taskApi";

interface Task {
    title: string;
    status: "pending" | "completed";
}


const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasksData = await getTasks();
                console.log('taskData', tasksData);

                // Set tasks from the tasks array in tasksData
                setTasks(tasksData.tasks);
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <h1>Your Tasks</h1>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        {task.title} - {task.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
