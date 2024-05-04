import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Off Ramp",
  description: "Sell you cyrpto to fiat",
});

const OffRampLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default OffRampLayout;
