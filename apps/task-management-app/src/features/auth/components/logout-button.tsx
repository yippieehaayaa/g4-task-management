import { LogOut } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
	onLogout?: () => void;
	isLoading?: boolean;
	variant?: React.ComponentProps<typeof Button>["variant"];
	size?: React.ComponentProps<typeof Button>["size"];
	showConfirmation?: boolean;
	children?: React.ReactNode;
};

function LogoutButton({
	onLogout,
	isLoading = false,
	variant = "outline",
	size = "default",
	showConfirmation = true,
	children,
}: LogoutButtonProps) {
	function handleConfirm() {
		onLogout?.();
	}

	if (showConfirmation) {
		return (
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant={variant} size={size} disabled={isLoading}>
						{children ?? (
							<>
								<LogOut className="size-4" aria-hidden />
								Log out
							</>
						)}
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Log out</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to log out? You will need to sign in again to
							access your account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							disabled={isLoading}
							variant="destructive"
						>
							{isLoading ? "Logging out…" : "Log out"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	}

	return (
		<Button
			variant={variant}
			size={size}
			disabled={isLoading}
			onClick={onLogout}
		>
			{children ?? (
				<>
					<LogOut className="size-4" aria-hidden />
					Log out
				</>
			)}
		</Button>
	);
}

export { LogoutButton };
