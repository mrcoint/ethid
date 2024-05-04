"use client";

import { useEffect, useState } from "react";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { BaseError, decodeAbiParameters, formatEther, parseAbiParameters, parseEther } from "viem";
import { useAccount } from "wagmi";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

const ClaimPage = () => {
  const { writeContractAsync, error, isSuccess } = useScaffoldWriteContract("Contract");
  const [ethAmount, setEthAmount] = useState("");
  const { address } = useAccount();
  const { data: getUserBalance } = useScaffoldReadContract({
    contractName: "Contract",
    functionName: "getUserBalance",
    args: [address],
  });
  useEffect(() => {
    if (getUserBalance === undefined) {
      return;
    }
    const parsedEthAmount = formatEther(getUserBalance!);
    setEthAmount(parsedEthAmount.toString());
  }, [getUserBalance]);

  useEffect(() => {
    if (error) {
      const parsedError = getParsedError(error);
      notification.error(parsedError);
    }
    if (isSuccess) {
      notification.success("Claimed successfully");
    }
  }, [error, isSuccess]);

  // const hanldeClaim = async () => {
  //     try {
  //         await writeContract(
  //             {
  //                 functionName: 'withdrawFund',
  //                 args: [
  //                     address,
  //                     parseEther(ethAmount),
  //                 ]
  //             })

  //     } catch (e) {
  //         console.error(e);
  //     }
  // }

  const submitTx = async (proof: ISuccessResult) => {
    try {
      await writeContractAsync({
        functionName: "execute",
        args: [
          address,
          BigInt(proof.merkle_root),
          BigInt(proof.nullifier_hash),
          decodeAbiParameters(parseAbiParameters("uint256[8]"), proof.proof as `0x${string}`)[0],
          parseEther(ethAmount),
        ],
      });
    } catch (error) {
      throw new Error((error as BaseError).shortMessage);
    }
  };

  // ...

  return (
    <div className="container mx-auto my-10">
      <div className="flex justify-center">
        <div className="space-y-2">
          <p className="font-semibold text-lg">Claim your tokens here</p>
          <p>Your current balance is {ethAmount} ETH</p>
          <EtherInput value={ethAmount} usdMode={false} onChange={value => setEthAmount(value)} />

          {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={hanldeClaim}>
                        Claim
                    </button> */}

          <IDKitWidget
            app_id="app_staging_1111f533fbb23185808467efc75c7bf7" // must be an app set to on-chain in Developer Portal
            action="claim-token"
            signal={address} // proof will only verify if the signal is unchanged, this prevents tampering
            onSuccess={submitTx} // use onSuccess to call your smart contract
            // no use for handleVerify, so it is removed
            // use default verification_level (orb-only), as device credentials are not supported on-chain
          >
            {({ open }) => (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={open}>
                Claim with World ID
              </button>
            )}
          </IDKitWidget>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;
