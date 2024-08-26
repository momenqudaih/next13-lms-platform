"use client"

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { title } from 'process'
import { Pencil } from 'lucide-react'

interface TitleFormProps {
    initialData: {
        title: string,
    }
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(3, {
        message: 'Title must be at least 3 characters long'
    }),
})

const TitleForm = ({
    initialData,
    courseId
}: TitleFormProps) => {

    const [isEditing, setIsEditing] = useState(false)

    const toggleEditing = () => setIsEditing((current)=> !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const {isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // try {
        //     await axios.put(`/api/courses/${courseId}`, values)
        // } catch (error) {
        //     console.error(error)
        // }
        console.log(values)
    }

    return ( 
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Title
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <Pencil className='h-4 w-4 mr-2'/>
                            Edit title
                        </>
                    )}
                    
                </Button>
            </div>
        </div>
    );
}

export default TitleForm
