import React from "react";
export function Textarea({ ...props }) {
  return <textarea className="p-2 border rounded-xl w-full" {...props}></textarea>;
}