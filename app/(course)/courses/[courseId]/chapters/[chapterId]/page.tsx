import { redirect } from 'next/navigation';
import { File } from 'lucide-react';

import { Banner } from '@/components/banner';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';

import { VideoPlayer } from './_components/video-player';
import { EnrollButton } from './_components/enroll-button';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    // Dynamic imports to prevent build-time issues
    const { auth } = await import('@clerk/nextjs');
    const { getChapter } = await import('@/actions/get-chapter');
    
    const { userId } = auth();

    if (!userId) {
        return redirect('/');
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        courseId: params.courseId,
        chapterId: params.chapterId,
    });

    if (!chapter || !course) {
        return redirect('/');
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant={'success'}
                    label="You already completed this chapter."
                />
            )}
            {isLocked && (
                <Banner
                    variant={'warning'}
                    label="You need to purchase this course to Watch this chapter."
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row justify-between items-center">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <div>{/* TODO: ADD COURSE PROGRESS BUTTON */}</div>
                        ) : (
                            <EnrollButton
                                courseId={params.courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description!} />
                    </div>
                    <div>
                        {!!attachments.length && (
                            <>
                                <Separator />
                                <div className="p-4">
                                    {attachments.map((attachment) => (
                                        <a
                                            key={attachment.id}
                                            href={attachment.url}
                                            target="_blank"
                                            className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                        >
                                            <File />
                                            <p className="line-clamp-1">
                                                {attachment.name}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;
