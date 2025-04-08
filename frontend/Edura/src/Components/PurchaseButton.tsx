import { ABI, contractAddress } from "@/utils/contractDetails";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

const PurchaseButton = ({data} : {data : {courseId  : number , price : any}}) => {

    console.log(data);

    const {writeContract , data : hash , isPending : transactionStarted} = useWriteContract({});
    const {isLoading , isSuccess , isError} = useWaitForTransactionReceipt({hash});


    const purchaseHandler = () => {
        writeContract({
            abi : ABI,
            address : contractAddress ,
            functionName : "buyCourse",
            args : [data.courseId],
            value : data.price
        })
    }

    if(isLoading){
        return <div className="px-3 py-1 text-center bg-purple-800 z-50 rounded-2xl">Loading...</div>
    }

    if(isError && !transactionStarted){
        return <div className="px-3 py-1 text-center bg-purple-800 z-50 rounded-2xl">Error...</div>
    }

    if(isSuccess && !transactionStarted){
        return <div className="px-3 py-1 text-center bg-purple-800 z-50 rounded-2xl">Watch</div>
    }
    
    return <button onClick={purchaseHandler} className="px-3 py-1 text-center bg-purple-800 z-50 rounded-2xl hover:cursor-pointer">Buy</button>
}


export default PurchaseButton;