import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex mt-10 h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
