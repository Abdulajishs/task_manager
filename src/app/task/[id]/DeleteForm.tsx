import { redirect } from "next/navigation";
import { deleteTask } from "../../actions/deleteTask";
import DeleteButton from "../../components/DeleteButton";
import { TaskData } from "./page";

export default function DeleteForm({ taskData }: { taskData: TaskData }) {
    async function deleteTaskAction() {
        'use server'
        const taskId = taskData?.id;
        await deleteTask(taskId);
        redirect('/dashboard');
    }

    return (
        <form action={deleteTaskAction} className="flex flex-col gap-5 rounded-md justify-center items-center border border-red-900 px-4 py-3 mb-5 ">
            <div className="w-full flex flex-col items-center">
                <h1 className="font-bold text-2xl text-center w-full text-yellow-500">Delete Task</h1>
                <hr className="w-full text-yellow-500" />
            </div>
            <input type='hidden' name="delete-task" value={taskData?.id} />
            <DeleteButton />
        </form>
    )
}