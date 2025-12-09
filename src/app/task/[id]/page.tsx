import { redirect } from "next/navigation";
import EditForm from "./EditForm";
import DeleteForm from "./DeleteForm";

import { auth } from "@clerk/nextjs/server";
import { Novu } from "@novu/node";
export type TaskData ={ id: string, title: string, isCompleted: boolean }

export default async function EditTask({ params }: { params: { id: string } }) {
    const { id } = await params;
    const task = await fetch(`https://69312fd611a8738467cd94c2.mockapi.io/tasks/${id}`);
    const taskData: TaskData = await task.json();

    async function updateTask(data: FormData) {
        'use server';

        const {userId} = await auth();
        if(!userId) {
            redirect('/sign-in');
        }

        const updateTitle = data.get('editing-title');
        const isCompleted = data.get('is-completed') === 'on' ? true : false;

        const res = await fetch(`https://69312fd611a8738467cd94c2.mockapi.io/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title: updateTitle, isCompleted: isCompleted }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const updatedTask = await res.json();
        console.log('Task updated:', updatedTask);

        const novu = new Novu(process.env.NOVU_SECRET_KEY!);
        await novu.trigger("in-app-alert", {
            to: { subscriberId: userId! },
            payload: { message: `The task "${updatedTask.title}" has been updated.` },
        });
        
        redirect('/dashboard');
        
    }

    return (
        <div className="flex flex-col justify-start items-center  bg-purple-500  w-full min-h-screen">
            <h1 className="font-bold text-2xl text-blue-800 text-center p-5">Task - {taskData?.title}</h1>
            <DeleteForm taskData={taskData} />
            <EditForm taskData={taskData} updateTask={updateTask} />
        </div>
    )
}