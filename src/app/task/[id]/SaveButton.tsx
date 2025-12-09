'use client';

import { useFormStatus } from "react-dom";

export default function SaveButton() {
    const { pending } = useFormStatus();
    console.log("Form pending status:", pending);
    return (
        <button
            type="submit"
            disabled={pending}
            className={`bg-blue-500 px-3 rounded-md  ${pending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            Save
        </button>
    )
}