import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return(
        <div className='absolute top-28 left-1/2 -translate-x-1/2 h-full'>
            <SignIn />
        </div>
    )
}