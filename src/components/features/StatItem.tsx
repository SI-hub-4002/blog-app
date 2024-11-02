import { StatProps } from "@/interface/interface"

export default function StatItem({ count, label }: StatProps) {
    return (
        <div className="w-24 flex flex-col gap-2 justify-center items-center border-r last:border-r-0">
            {count}
            <span className="text-gray-400">{label}</span>
        </div>
    )
};