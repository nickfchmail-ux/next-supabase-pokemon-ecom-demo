import UserProfile from '../../_component/UserProfile';
import { CardContent, CardTitle } from '../../_componentAPI/card';
import { auth } from '../../_lib/auth';
import { getUser } from '../../_lib/data-service';
export default async function Page() {
  const session = await auth();

  const { id, created_at, ...userProfile } = await getUser(session.user.email);

  console.log('user profile: ', userProfile);

  return (
    <div className="h-full bg-gray-50  px-4">
      <div className="flex text-center flex-col g-0  rounded-t-lg p-0 h-[15vh]  place-items-center bg-amber-500 mt-1 mb-2">
        <CardTitle className="text-4xl font-extrabold text-amber-950 mt-8 bg">My Profile</CardTitle>
        <div className={`text-xs flex flex-col self-end mr-2 text-amber-900`}>
          {' '}
          {session.user.email}
        </div>
      </div>
      <CardContent className="px-0">
        <UserProfile>{userProfile}</UserProfile>
      </CardContent>
    </div>
  );
}
