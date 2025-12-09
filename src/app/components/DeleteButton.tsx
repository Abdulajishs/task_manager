'use client'
import { useFormStatus } from "react-dom"

export default function DeleteButton() {
    const formStatus = useFormStatus()
    // console.log("Pending status:", formStatus);
    return (
        <button
            className={`text-white bg-red-500 px-2 rounded-md  ${formStatus.pending ? 'opacity-50 bg-red-100 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={formStatus.pending}
        >
            Delete
        </button>
    )
}