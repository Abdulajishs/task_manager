import Link from "next/link";
import DeleteButton from "../components/DeleteButton";
import { deleteTask } from "../actions/deleteTask";
import { revalidatePath } from "next/cache";

type Task = {
    id: string;
    title: string;
    isCompleted: boolean;
}

export default async function Dashboard() {
    const response = await fetch('https://69312fd611a8738467cd94c2.mockapi.io/tasks');
    const tasks = await response.json();
    async function deleteTaskAction(data: FormData) {
        'use server';
        const taskId = data.get("taskId") as string;
        await deleteTask(taskId);
        revalidatePath('/dashboard');
    }

    return (
        <div className="flex flex-col ">
            <Link href='/task/new' className="w-[150px] bg-green-500 text-white text-center p-2 rounded-md mx-auto mb-5  mt-5 cursor-pointer">Add New Task</Link>
            <div id='tasks-list' className="flex flex-col sm:justify-center sm:items-center gap-5 p-5">
                {tasks.map((task: Task) => (
                    <div key={task.id} className="flex items-center gap-3 sm:gap-10">
                        <h2 className="w-[100px]">Task ID: {task.id}</h2>
                        <h2 className="w-[200px]">{task.title}</h2>
                        <input type="checkbox" defaultChecked={task.isCompleted} disabled />
                        <Link href={`/task/${task.id}`} className="text-grey-500 bg-blue-500 px-2 rounded-md cursor-pointer">Edit</Link>
                        <form action={deleteTaskAction}>
                            <input type="hidden" name="taskId" value={task.id} />
                            <DeleteButton />
                        </form>
                    </div>
                ))}
            </div>
        </div>
    )
}