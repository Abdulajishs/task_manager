
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Novu, PushProviderIdEnum } from "@novu/node";

const novu = new Novu(process.env.NOVU_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { token } = await req.json();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!token) {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const email = user?.emailAddresses[0]?.emailAddress;

    // Save token in Clerk user metadata
    await clerkClient().then((client) =>
      client.users.updateUserMetadata(userId, {
        publicMetadata: {
          fcmToken: token,
        },
      })
    );

    // Ensure subscriber exists in Novu
    await novu.subscribers.identify(userId, {
      email,
    });

    // Register push token for Push notifications
    await novu.subscribers.setCredentials(
      userId,
      PushProviderIdEnum.FCM, // Correct Provider ID for Firebase Cloud Messaging
      {
        deviceTokens: [token],
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SAVE TOKEN ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
