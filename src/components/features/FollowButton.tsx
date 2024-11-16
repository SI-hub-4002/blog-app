import Button from "@/components/elements/Button"

interface FollowProps {
    isFollowing: boolean
}

export default function FollowButton({isFollowing}: FollowProps) {
    return (
        <div>
            {isFollowing ? <Button className="bg-slate-50 font-normal text-lg p-1">following</Button> : <Button className="bg-slate-50 font-normal text-lg p-1">follow</Button>}
        </div>
    )
}