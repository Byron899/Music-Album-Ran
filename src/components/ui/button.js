import React from "react";
export function Button({ children, ...props }) {
  return <button className="px-4 py-2 rounded-xl bg-blue-500 text-white" {...props}>{children}</button>;
}