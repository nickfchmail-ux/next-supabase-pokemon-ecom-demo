import SignInButton from "../_component/SignInButton";
export default function Page() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center gap-4">
        <h1>Please sign in to continue shopping</h1>
        <SignInButton />
      </div>
    </div>
  );
}
