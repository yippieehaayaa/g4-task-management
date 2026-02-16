import { Link } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	ListTodo,
	Monitor,
	Settings,
	ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navCards = [
	{
		to: "/tasks",
		title: "Tasks",
		description: "Manage your tasks, set priorities, and track progress.",
		icon: ListTodo,
		iconClass: "bg-primary/10 text-primary",
	},
	{
		to: "/sessions",
		title: "Sessions",
		description: "Manage active sessions and devices.",
		icon: Monitor,
		iconClass: "bg-muted text-muted-foreground",
	},
	{
		to: "/settings",
		title: "Settings",
		description: "Account and preferences.",
		icon: Settings,
		iconClass: "bg-muted text-muted-foreground",
	},
] as const;

export function DashboardPage() {
	return (
		<div className="space-y-8">
			<header className="space-y-2">
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Dashboard
				</h1>
				<p className="text-muted-foreground max-w-xl text-sm sm:text-base">
					Welcome back. Choose where to go next.
				</p>
				<Separator className="mt-4" />
			</header>

			<section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
				{navCards.map(({ to, title, description, icon: Icon, iconClass }) => (
					<Link
						key={to}
						to={to}
						className="group block rounded-xl outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:opacity-95"
					>
						<Card className="h-full overflow-hidden border transition-colors hover:border-accent/50 hover:shadow-sm group-focus-visible:border-accent/50">
							<CardHeader className="gap-4 pb-3 sm:pb-4">
								<div className="flex items-start gap-4">
									<div
										className={cn(
											"flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:opacity-90",
											iconClass,
										)}
									>
										<Icon className="size-5" aria-hidden />
									</div>
									<div className="min-w-0 flex-1 space-y-1">
										<CardTitle className="flex items-center justify-between gap-2 text-base font-semibold">
											{title}
											<ArrowRight className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
										</CardTitle>
										<CardDescription className="text-sm leading-relaxed line-clamp-2">
											{description}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="px-6 pb-6 pt-0">
								<span className="text-primary text-sm font-medium underline-offset-4 group-hover:underline">
									Open →
								</span>
							</CardContent>
						</Card>
					</Link>
				))}
			</section>
		</div>
	);
}
