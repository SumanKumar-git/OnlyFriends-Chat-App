

const GroupSystemMessage = ({ message }) => {
    return (
        <div className="w-full flex justify-center">
            <div className="px-2 py-1 w-fit max-w-[45%] bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-xs text-center w-full text-gray-600">{message.text}</span>
            </div>
        </div>
    )
}

export default GroupSystemMessage