import { useEffect, useState } from "react";
import { ethers } from "ethers";
import FundMe from "./FundMe.json"
function App() {
  const [account, setAccount] = useState("");
  const [fundAmount, setFundAmount] = useState(0)
  const [balance, setBalance] = useState(0)
  const connectToMetamask = async () => {
    const { ethereum } = window;
    if (!ethereum) return alert("Please install metamask");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  const withdraw = async()=>{
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0x3fDDEc9393Ae0Be5DFcAd05E24187A2fec3Fad42",FundMe.abi,signer);
      await contract.withdraw();
      console.log("withdrawn successfull")
    }catch(e){
      console.log(e)
    }
 
  }

  useEffect(() => {
    connectToMetamask();
    getBalance()
  }, []);

  const fund=async(e)=>{
    e.preventDefault()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract("0x3fDDEc9393Ae0Be5DFcAd05E24187A2fec3Fad42",FundMe.abi,signer);
    const tx = await contract.fund({value:ethers.utils.parseEther(fundAmount.toString())});
    await provider.once(tx.hash,()=>console.log("Funded Successfully"))
  }

  const getBalance=async()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance("0x3fDDEc9393Ae0Be5DFcAd05E24187A2fec3Fad42")
    console.log(ethers.utils.formatEther(balance))
   setBalance(ethers.utils.formatEther(balance))

  }

  return <div className="App">
    <h1>Balance : {balance}</h1>
    <form onSubmit={fund}>
      <input type="number" name="" id="" placeholder="Fund Amount" value={fundAmount} onChange={(e)=>setFundAmount(e.target.value)} />
      <button type="submit">Fund</button>

    </form>
      <button onClick={withdraw}>Withdraw</button>
  </div>;
}

export default App;
