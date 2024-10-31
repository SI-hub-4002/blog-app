export default function Input (props: React.InputHTMLAttributes<HTMLInputElement>) {
    const {className, ...rest} = props;
    return(
        <div>
            <input type="text" className={`rounded-lg ${className}`} {...rest}/>
        </div>
    )
}