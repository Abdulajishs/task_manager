'use client';
import SaveButton from "./SaveButton";
import { TaskData } from "./page";

type EditFormProps = {
    taskData: TaskData;
    updateTask: (data: FormData) => Promise<void>;
}

export default function EditForm({ taskData, updateTask }: EditFormProps) {

    return (
        <form action={updateTask} className="flex flex-col gap-5 rounded-md justify-center items-start border border-purple-900 px-4 py-3 mb-5 ">
           <div className="w-full flex flex-col items-center">
             <h2 className="font-bold text-2xl text-center w-full text-yellow-500">Edit</h2>
            <hr className="w-full text-yellow-500"/>
           </div>
            <div className="flex justify-center items-center gap-2">
                <label htmlFor="editing-title" className="font-bold cursor-pointer" >Title:</label>
                <input
                    type="text"
                    id="editing-title"
                    name="editing-title"
                    defaultValue={taskData.title}
                    className="border p-1 rounded-md focus:outline-none"
                    required />
            </div>
            <div className="flex justify-center items-center gap-2">
                <label htmlFor="is-completed" className="font-bold cursor-pointer">Completed:</label>
                <input
                    id="is-completed"
                    type="checkbox"
                    name="is-completed"
                    defaultChecked={taskData.isCompleted} />
            </div>
            <div className="flex  justify-center w-full">
                <SaveButton />
            </div>
        </form>
    )
}