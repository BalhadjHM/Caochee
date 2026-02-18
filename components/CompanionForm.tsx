"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { subjects } from "@/constants";
import { Textarea } from "./ui/textarea";
import { createCompanion } from "@/lib/actions/companion.actions";
import { redirect } from "next/navigation";

// 1. Define your schema with Zod
const formSchema = z.object({
	name: z.string().min(1, "Companion name is required"),
	subject: z.string().min(1, "Companion subject is required"),
	topic: z.string().min(1, "Companion topic is required"),
	voice: z.string().min(1, "Companion voice is required"),
	style: z.string().min(1, "Companion style is required"),
	duration: z.coerce.number().min(1, "Companion duration is required"),
});

// Infer the type from schema
type FormValues = z.infer<typeof formSchema>;

const CompanionForm = () => {
	// 2. Initialize the form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			subject: "",
			topic: "",
			voice: "",
			style: "",
			duration: 15,
		},
	});

	// 3. Handle submission
	const onSubmit = async (values: FormValues) => {
		const companion = await createCompanion(values);
		if (companion) {
			redirect(`/companions/${companion.id}`);
		} else {
            console.error("Failed to create companion");
            redirect('/');
        }
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Companion Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Mark Zuckerburg"
									{...field}
									className="input"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="subject"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subject</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className="input capitalize">
										<SelectValue placeholder="Select a Subject" />
									</SelectTrigger>
									<SelectContent>
										{subjects.map((subject) => (
											<SelectItem
												key={subject}
												value={subject}
												className="capitalize"
											>
												{subject}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="topic"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								What Should the Companion Help With?
							</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Ex. I want to learn about the stock market"
									{...field}
									className="input"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="voice"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Companion Voice</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className="input">
										<SelectValue placeholder="Select a Voice" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">
											Male
										</SelectItem>
										<SelectItem value="female">
											Female
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="style"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Companion Style</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<SelectTrigger className="input">
										<SelectValue placeholder="Select a Style" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="formal">
											Formal
										</SelectItem>
										<SelectItem value="casual">
											Casual
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="duration"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Estimated Duration Session (minutes)
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="Ex. 15 minutes"
									{...field}
									className="input"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full cursor-pointer">
					Build Your Companion
				</Button>
			</form>
		</Form>
	);
};

export default CompanionForm;
