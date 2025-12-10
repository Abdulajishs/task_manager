"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Inbox } from "@novu/nextjs";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../firebase/firebase-config";

export default function NavBar() {
    const pathname = usePathname();
    const { user } = useUser();
    const subscriberId = user?.id;
    const appId = process.env.NEXT_PUBLIC_NOVU_APP_ID;

    const [permission, setPermission] = useState<NotificationPermission | null>(null);

    // Detect permission on client
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    // Service worker + foreground listener
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!("serviceWorker" in navigator)) return;

        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) =>
                console.log("Service Worker Registered:", registration)
            )
            .catch((err) => console.log("SW Registration Failed:", err));

        onMessage(messaging, (payload) => {
            console.log("Foreground Push:", payload);
            alert(payload.notification?.title + " → " + payload.notification?.body);
        });
    }, []);

    // Request permission + register token
    const requestPushPermission = async () => {
        if (typeof window === "undefined") return;

        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult !== "granted") return;

        const registration = await navigator.serviceWorker.ready;

        if (!("PushManager" in window)) {
            console.error("Push Not Supported in this browser");
            return;
        }

        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        console.log("FCM Token:", token);

        const res = await fetch("/api/save-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        if (res.ok) {
            console.log("Token saved to backend");
        }
    };

    return (
        <nav className="w-full h-16 bg-blue-600 flex justify-between items-center px-4 text-white">
            <h1 className="text-2xl font-bold">Task Manager</h1>

            <div>
                <Link href="/dashboard" className="mx-4 hover:underline">Dashboard</Link>
                <Link href="/task/new" className="mx-4 hover:underline">Add Task</Link>
            </div>

            <div className="flex gap-3 justify-center items-center">

                <SignedIn>
                    {/* Only show button if permission not given yet */}
                    {permission === "default" && (
                        <button
                            onClick={requestPushPermission}
                            className="bg-black px-3 py-1 rounded text-white hover:bg-gray-800"
                        >
                            Enable Push 🔔
                        </button>
                    )}
                </SignedIn>

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
                                colorForeground: "#0E121B",
                            },
                        }}
                    />
                </SignedIn>
            </div>
        </nav>
    );
}
