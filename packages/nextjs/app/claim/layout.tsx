import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Claim Funds",
  description: "Claim your funds",
});

const ClaimLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ClaimLayout;
