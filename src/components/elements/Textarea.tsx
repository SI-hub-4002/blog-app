export default function Textarea (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const {className, ...rest} = props;
    return(
        <textarea className={`w-full h-full resize-none p-1 focus:outline-none border border-gray-700 ${className}`} {...rest}/>
    )
}