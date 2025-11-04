import { GraduationCap } from 'lucide-react';

export const Logo = () => (
    <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Eduflex
        </h1>
    </div>
);
