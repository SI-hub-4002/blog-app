import Button from "@/components/elements/button/Button";

export default function SelectButton() {
    return (
        <div className="absolute z-1 left-1/2 -translate-x-1/2 flex items-center p-4 h-16">
            <div className="shadow-md rounded-xl bg-white">
                <Button className="h-8 w-20">All</Button>
                <Button className="h-8 w-20">Follows</Button>
                <Button className="h-8 w-20">Likes</Button>
            </div>
        </div>
    )
}