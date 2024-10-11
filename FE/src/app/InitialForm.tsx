"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import axios from "axios"
import { apiUrl } from "./utils"


const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    nativeLanguage: z.string().min(1, "Native language is required"),
    targetLanguage: z.string().min(1, "Target language is required"),
    proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"], {
        required_error: "Proficiency level is required",
    }),
    favoriteShow: z.string().min(1, "Favorite show is required"),
});

export type TVShow = {
    adult: boolean;
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    name: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
};

type TVShowDropdown = Pick<TVShow, 'id' | 'name' | 'popularity'>

type FormData = {
    name: string;
    email: string;
    nativeLanguage: string;
    targetLanguage: string;
    proficiencyLevel: string;
    favoriteShow: string;
}

export function InitialForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            nativeLanguage: "",
            targetLanguage: "",
            proficiencyLevel: "beginner",
            favoriteShow: "",
        },
    });

    const [shows, setShows] = useState<TVShow[]>([])
    const [loading, setLoading] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchShows = async (query: string) => {
        if (query.length < 1) return
        try {
            const response = await axios.get(`/api/searchShows`, {
                params: { query },
            });

            const fetchedShows = response.data.results.map((tvshow: TVShowDropdown) => ({ name: tvshow.name, id: tvshow.id, popularity: tvshow.popularity }))

            setShows(fetchedShows);
            //setShows(fetchedShows)
        } catch (error) {
            console.error("Error fetching shows:", error)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: FormData) => {

        try {
            const response = await fetch(`${apiUrl}/submit-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorDetail = await response.json();
                console.error(`Error ${response.status}: ${errorDetail.error}`);
                return;
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nativeLanguage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Native Language</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., English" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="targetLanguage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Language</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Spanish" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="proficiencyLevel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proficiency Level</FormLabel>
                                    <FormControl>
                                        <select {...field}>
                                            <option value="">Select your level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="favoriteShow"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Favorite Show</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Search for your favorite show"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                fetchShows(e.target.value)
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    {loading && <p>Loading...</p>}
                                    {isDropdownOpen && shows.length > 0 && (
                                        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md max-h-20 md:max-h-32 overflow-y-auto w-fit">
                                            {shows.map((show) => (
                                                <li key={show.id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => {
                                                    field.onChange(show.name);
                                                    setShows([]);
                                                    setIsDropdownOpen(false);
                                                }}>
                                                    {show.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
