import type * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
	id: string;
	label: string;
	type?: React.ComponentProps<typeof Input>["type"];
	placeholder?: string;
	error?: string;
	disabled?: boolean;
	autoComplete?: string;
	required?: boolean;
} & Omit<React.ComponentProps<typeof Input>, "id" | "aria-invalid" | "aria-describedby">;

function FormField({
	id,
	label,
	type = "text",
	placeholder,
	error,
	disabled,
	autoComplete,
	required,
	className,
	...inputProps
}: FormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id} className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : undefined}>
				{label}
			</Label>
			<Input
				id={id}
				type={type}
				placeholder={placeholder}
				autoComplete={autoComplete}
				disabled={disabled}
				aria-invalid={Boolean(error)}
				aria-describedby={error ? `${id}-error` : undefined}
				className={cn(className)}
				{...inputProps}
			/>
			{error ? (
				<p id={`${id}-error`} className="text-destructive text-sm" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

export { FormField };
