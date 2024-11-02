export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const {className, children, ...rest} = props;
    return(
        <button type="submit" className={`rounded-xl text-gray-700 ${className}`} {...rest}>{children}</button>
    )
}