import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Novu } from "@novu/node";

export async function deleteTask(taskId: string) {
        "use server";

        const {userId} = await auth();
        const user = await currentUser();
         const userEmail = user?.emailAddresses[0]?.emailAddress;
        if(!userId) {
            redirect('/sign-in');
        }


        const res = await fetch(`https://69312fd611a8738467cd94c2.mockapi.io/tasks/${taskId}`, {
            method: "DELETE",
        })
        const deletedTask = await res.json();
        console.log("Task deleted:", deletedTask);

        const novu = new Novu(process.env.NOVU_SECRET_KEY!);

        await novu.subscribers.identify(userId!, {
            email: userEmail
        });

        await novu.trigger("in-app-alert", {
            to: { subscriberId: userId! },
            payload: { message: `The task "${deletedTask.title}" has been deleted.`, title: deletedTask.title },
        });

    }