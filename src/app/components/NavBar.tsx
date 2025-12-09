'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Inbox } from "@novu/nextjs";
import { useUser } from "@clerk/nextjs";

export default function NavBar() {
    const pathname = usePathname();
    const { user } = useUser()
    const subscriberId = user?.id;
    const appId = process.env.NEXT_PUBLIC_NOVU_APP_ID;
    return (
        <nav className="w-full h-16 bg-blue-600 flex justify-between items-center px-4 text-white">
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <div>
                <Link href='/dashboard' className="mx-4 hover:underline">Dashboard</Link>
                <Link href='/task/new' className="mx-4 hover:underline">Add Task</Link>
            </div>
            <div className="flex gap-2 justify-center items-center">
                <SignedOut>
                    <SignInButton mode="modal" />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedIn>
                <Inbox
                    applicationIdentifier={appId!}
                    subscriberId={subscriberId!}
                    appearance={{
                        variables: {
                            colorPrimary: "#6c6365ff",
                            colorForeground: "#0E121B"
                        }
                    }}
                />
                </SignedIn>
            </div>
        </nav>
    )
}