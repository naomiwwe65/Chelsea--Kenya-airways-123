import * as React from "react";

export function Table({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <table className={className ?? "w-full text-sm"}>{children}</table>;
}

export function TableHeader({ children }: React.PropsWithChildren) {
  return <thead className="text-white/70 bg-white/5">{children}</thead>;
}

export function TableBody({ children }: React.PropsWithChildren) {
  return <tbody className="divide-y divide-white/10">{children}</tbody>;
}

export function TableRow({ children }: React.PropsWithChildren) {
  return <tr className="hover:bg-white/5 transition-colors">{children}</tr>;
}

export function TableHead({ children }: React.PropsWithChildren) {
  return <th className="text-left p-2 font-medium">{children}</th>;
}

export function TableCell({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={"p-2 " + (className ?? "")}>{children}</td>;
}




