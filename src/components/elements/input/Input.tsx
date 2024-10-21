export default function Input (props: React.InputHTMLAttributes<HTMLInputElement>) {
    return(
        <div>
            <input type="text" className="rounded-md" {...props}/>
        </div>
    )
}