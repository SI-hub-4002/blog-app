import { ModalProps } from "@/interface/interface";
import Button from "../elements/Button";

export default function Modal({ isModalOpen, closeModal, handleUserDeleteAction }: ModalProps): JSX.Element | null {
    if (!isModalOpen) {
        return null; 
    };
    
    return (
        <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Are you sure you want to delete it?</h3>
                <p>Once you delete, it cannot be restored.</p>
                <div className="mt-4 flex justify-between">
                    <Button onClick={closeModal} className="bg-gray-700 hover:bg-gray-600 text-white p-1 text-xl">Cancel</Button>
                    <form onSubmit={handleUserDeleteAction}>
                        <Button className="bg-red-500 hover:bg-red-400 text-white p-1 text-xl">Delete</Button>
                    </form>
                </div>
            </div>
        </div>
    )
};