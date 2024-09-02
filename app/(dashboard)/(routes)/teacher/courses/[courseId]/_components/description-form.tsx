"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Course } from '@prisma/client'

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(3, {
        message: 'Description must be at least 3 characters long'
    }),
})

const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const toggleEditing = () => setIsEditing((current)=> !current);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    });

    const {isSubmitting, isValid} = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course description updated successfully")
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error("An error occurred while updating the course description")
        }
    }

    return ( 
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course description
                <Button onClick={toggleEditing} variant="ghost">
                    {
                        isEditing ? (
                            <>Cancel</>
                        ): (
                            <>
                                <Pencil className='h-4 w-4 mr-2' />
                                Edit description
                            </>
                        )

                    }
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description  && "text-slate-500 italic"
                )}>
                    {initialData.description || 'No description provided'}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='description'
                            render={({field})=>(
                                <FormItem>
                                    <FormControl>
                                        <Textarea 
                                            {...field} 
                                            disabled={isSubmitting} 
                                            placeholder='e.g. This course will teach you...' 
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button
                                type='submit'
                                disabled={!isValid || isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}

export default DescriptionForm
