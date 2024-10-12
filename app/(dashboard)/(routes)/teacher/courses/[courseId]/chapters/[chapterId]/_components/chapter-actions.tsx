'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished,
}: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(
                    `/api/courses/${courseId}/chapters/${chapterId}/unpublish`,
                );
                toast.success('Chapter UnPublished Successfully');
            } else {
                await axios.patch(
                    `/api/courses/${courseId}/chapters/${chapterId}/publish`,
                );
                toast.success('Chapter Published Successfully');
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

            await axios.delete(
                `/api/courses/${courseId}/chapters/${chapterId}`,
            );

            toast.success('Chapter deleted Successfully');
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
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
                {isPublished ? 'Unpublished' : 'Publish'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};

export default ChapterActions;
