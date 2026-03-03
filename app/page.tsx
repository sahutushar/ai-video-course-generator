import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserButton} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Subscribe to my channel</h2>
        <UserButton/>
      </div>
      <Button>Subscribe</Button>
    </div>
  );
}
