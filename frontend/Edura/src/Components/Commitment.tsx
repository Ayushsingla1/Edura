import { useState } from "react"
import { Zap, Calendar, DollarSign, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import "../Components/loader.css"
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { ABI, contractAddress } from "@/utils/contractDetails"
import { parseEther } from "viem"
import axios from "axios"
const CommitMent = () => {

    const [showCommitmentDialog, setShowCommitmentDialog] = useState(false);
    const [commitmentTask, setCommitmentTask] = useState("");
    const [commitmentAmount, setCommitmentAmount] = useState("");
    const [commitmentDeadline, setCommitmentDeadline] = useState("");
    const [verificationPending, setVerificationPending] = useState(false);
    const {address} = useAccount();

    const {data , isPending : fetchingCommitment  ,isSuccess :commitmentFetched,  error : commitmentFetchError ,} = useReadContract({
        abi : ABI,
        address : contractAddress,
        functionName : "getStudentTasks",
        account : address
    })

    const { writeContract, data : hash  , isPending : transactionStarted} = useWriteContract({});
    const {isPending}  = useWaitForTransactionReceipt({hash});


    const handleCreateCommitment = async () => {
        if (!commitmentTask || !commitmentAmount || !commitmentDeadline) {
            alert("Please fill all fields");
            return;
        }

        console.log(commitmentAmount,Date.parse(commitmentDeadline),"task",commitmentTask);

        writeContract({
            abi : ABI,
            address : contractAddress,
            functionName : "lockAmount",
            args : [parseEther(commitmentAmount),(Date.parse(commitmentDeadline)-Date.now())/1000,"task",commitmentTask],
            value : parseEther(commitmentAmount)
        })
    };

    const handleVerifyCompletion = async () => {
        setVerificationPending(true);
        try {
            const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/verify`,{params : {userAddress : address}});
            if(result.status === 200){
                console.log("Successfully verified")
            }
            else{
                console.log("Error occured while verifying")
            }
        } catch (error) {
            console.error("Error verifying completion:", error);
            alert("Verification failed. Please try again.");
        } finally {
            setVerificationPending(false);
        }
    };


    const formatDeadlineDate = (dateString : string) => {
        const date = new Date(parseInt(String(dateString)));
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if(fetchingCommitment) return <div className="flex w-screen justify-center items-center bg-gray-950"><span className="loader"></span></div>
    if(commitmentFetchError) return <div className="flex w-screen justify-center items-center bg-gray-950 flex-col"><span>Ran into some Error</span></div>

    if(!fetchingCommitment && commitmentFetched){
        return <section className="bg-gray-950 py-8 w-screen flex justify-center">
        <div className="container px-4 md:px-6">
            <div className="border border-purple-900/30 rounded-lg p-6 bg-purple-900/10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Commitment Contract
                    </h2>
                    
                    {
                    !(data as any)?.finished && (
                        <Dialog open={showCommitmentDialog} onOpenChange={setShowCommitmentDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    Create New Commitment
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-purple-800">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold text-white">Create a Commitment</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                        Set a task, deadline, and stake some EDU tokens as motivation to complete the course.
                                        If you succeed, you'll get it all back. If not, your stake is lost.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label htmlFor="task" className="text-sm font-medium text-gray-200">
                                            What do you commit to complete?
                                        </label>
                                        <Textarea
                                            id="task"
                                            placeholder="e.g., Complete the first 3 lectures of this course"
                                            value={commitmentTask}
                                            onChange={(e) => setCommitmentTask(e.target.value)}
                                            className="bg-gray-800 text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="amount" className="text-sm font-medium text-gray-200">
                                                Stake Amount (EDU)
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="amount"
                                                    placeholder="50"
                                                    type="number"
                                                    value={commitmentAmount}
                                                    onChange={(e) => setCommitmentAmount(e.target.value)}
                                                    className="pl-10 bg-gray-800 text-white border-gray-700 focus:ring-purple-600 focus:border-purple-600"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="deadline" className="text-sm font-medium text-gray-200">
                                                Deadline
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="deadline"
                                                    type="date"
                                                    value={commitmentDeadline}
                                                    onChange={(e) => setCommitmentDeadline(e.target.value)}
                                                    className="pl-10 text-white bg-gray-800 border-gray-700 focus:ring-purple-600 focus:border-purple-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCommitmentDialog(false)}
                                        className="border-gray-700 hover:bg-gray-800 text-gray-300"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateCommitment}
                                        disabled={transactionStarted && isPending}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        {transactionStarted && isPending ? 'Creating...' : 'Create Commitment'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {(data as any)?.finished ? (
                    <Card className="bg-gray-900 border-purple-900/30">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
                                Active Commitment
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Complete your commitment before the deadline to get your stake back
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-400">Task</h4>
                                <p className="text-white mt-1">{(data as any)?.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400">Amount Staked</h4>
                                    <p className="text-white mt-1 flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                                        {((data as any)?.lockedAmount)} EDU
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400">Deadline</h4>
                                    <p className="text-white mt-1 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                                        {formatDeadlineDate((data as any)?.endsAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center text-sm text-amber-400 mb-4">
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    You must verify completion before the deadline or your stake will be lost
                                </div>
                                <Button
                                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                                    onClick={handleVerifyCompletion}
                                    disabled={verificationPending}
                                >
                                    {verificationPending ? 'Verifying...' : 'Verify Completion'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-8 px-4">
                        <div className="inline-block p-4 rounded-full bg-purple-900/20 mb-4">
                            <Zap className="h-10 w-10 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">Boost Your Learning</h3>
                        <p className="text-gray-400 max-w-lg mx-auto mb-6">
                            Create a commitment by staking EDU tokens. Complete your task by the deadline to get
                            your tokens back. This helps maintain accountability and motivation.
                        </p>
                        <Button
                            onClick={() => setShowCommitmentDialog(true)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            Create Your First Commitment
                        </Button>
                    </div>
                )}
            </div>
        </div>
    </section>
    }

}


export default CommitMent;