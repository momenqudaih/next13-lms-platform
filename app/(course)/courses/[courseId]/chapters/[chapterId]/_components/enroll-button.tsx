import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';

interface EnrollButtonProps {
    courseId: string;
    price: number;
}

export const EnrollButton = ({ courseId, price }: EnrollButtonProps) => {
    return (
        <Button size="sm" className="w-full md:w-auto">
            Enroll for {formatPrice(price)}
        </Button>
    );
};
