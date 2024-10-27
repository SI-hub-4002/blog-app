import Button from "@/components/elements/button/Button";

export default function SelectButton() {
    return (
        <div className="absolute z-1 left-1/2 -translate-x-1/2 flex items-center h-16">
            <div className="shadow-md rounded-3xl bg-white">
                <Button className="h-10 w-24 text-lg">All</Button>
                <Button className="h-10 w-24 text-lg">Follows</Button>
                <Button className="h-10 w-24 text-lg">Likes</Button>
            </div>
        </div>
    )
}