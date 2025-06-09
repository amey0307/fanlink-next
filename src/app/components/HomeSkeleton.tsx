import React from 'react'
import { SkeletonCard } from './SkeletonCard';
import { Skeleton } from "@/app/components/ui/skeleton";
import { useTheme } from '@/app/context/ThemeProvider';


function HomeSkeleton() {
    const { theme } = useTheme();

    return (
        <div className={`${theme}`}>
            <div className='min-h-screen dark:bg-[#011701] pt-10'>
                <Skeleton className='h-[20vh] w-[60vw] mx-auto mt-10' />
                <div className='mx-auto'>
                    <Skeleton className='h-16 w-[40vw] mt-10 mx-auto' />
                </div>
                <div className='w-[60vw] mx-auto mt-10'>
                    <div className='flex items-center justify-center gap-20 mt-10'>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                    <div className='flex items-center justify-center gap-20 mt-10'>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeSkeleton
