'use client'

import { useEffect } from "react"

export default function Error({err }: {err: Error}) {

    useEffect(() => {
        console.error("Error occurred:", err);
    }, [err]);

    return(
        <div className="flex justify-center items-center ">
            <h1 className="text-red-500 text-3xl"> Something went wrong!</h1>
        </div>
    )
}