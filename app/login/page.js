import SignInView from '../_component/SignInView';

export const metadata = {
  title: 'Login',
  description:
    'please register your account with google email and provide your authentication from google for using your account information to set up your account on our ecommerce store.',
};




export default function Page() {
  return (
    <div className="h-[86vh] flex flex-col items-center justify-center space-y-6">
      <SignInView />
    </div>
  );
}
