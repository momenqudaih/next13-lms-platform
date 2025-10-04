'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface EnrollButtonProps {
    courseId: string;
    price: number;
}

export const EnrollButton = ({ courseId, price }: EnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(`/api/courses/${courseId}/checkout`);

            window.location.assign(response.data.url);
        } catch (error) {
            toast.error("Something went wrong");
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <Button onClick={onClick} disabled={isLoading} size="sm" className="w-full md:w-auto">
            Enroll for {formatPrice(price)}
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        </Button>
    );
};
