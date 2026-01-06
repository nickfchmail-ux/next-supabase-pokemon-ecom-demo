import SideBar from '../_component/SideBar';

export default function AccountLayout({ children }) {
  return (
    <div className="grid grid-cols-1  md:grid-cols-[max-content_4fr] h-[83.5vh] overflow-hidden">
      <div className={`h-[83.5vh] hidden sm:hidden md:grid bg-white overflow-hidden`}>
        <SideBar />
      </div>

      <div className={` overflow-y-scroll w-full h-full`}>{children}</div>
    </div>
  );
}
