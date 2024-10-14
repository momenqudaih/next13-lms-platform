'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useConfettiStore } from '@/hooks/use-confetti-store';

interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success('Course UnPublished Successfully');
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success('Course Published Successfully');
                confetti.onOpen();
            }

            router.refresh();
        } catch (error) {
            toast.error('something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success('course deleted Successfully');
            router.push(`/teacher/courses`);
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? 'Unpublish' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};
