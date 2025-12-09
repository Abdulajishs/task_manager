import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Novu } from "@novu/node";

export default function NewTask() {

    const addTask = async (data: FormData) => {
        'use server';

        const { userId } = await auth();

        const user = await currentUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;


        if (!userId) {
            redirect('/sign-in');
        }

        const newTask = data.get("title") as string | null;
        if (!newTask || newTask.trim() === "") {
            throw new Error("Task title is required");
        }

        const res = await fetch('https://69312fd611a8738467cd94c2.mockapi.io/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: newTask, isCompleted: false }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const task = await res.json();

        console.log('Task added:', task);

        const novu = new Novu(process.env.NOVU_SECRET_KEY!);

        await novu.subscribers.identify(userId!, {
            email: userEmail
        });

        console.log('Subscriber identified:', userId, userEmail);

        await novu.trigger("in-app-alert", {
            to: { subscriberId: userId! },
            payload: { message: `A new task "${task.title}" has been created.`, title: newTask },
        });

        redirect('/dashboard');
    }

    return (
        <div className="flex flex-col p-5 ">
            <h1 className="w-full flex justify-center items-center px-5 mb-0 sm:mb-5 text-2xl">Add New Task</h1>
            <form action={addTask} className="flex flex-col gap-5 w-full sm:w-[400px] mx-auto p-5 border border-gray-300 rounded-md">
                <input type="text" name="title" placeholder="Task Title" className="p-2 border border-gray-300 rounded-md" />
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-md cursor-pointer">Create Task</button>
            </form>
        </div>
    )
}