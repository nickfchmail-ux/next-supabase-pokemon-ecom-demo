function Overlay({ children, view }) {
  return (
    <div
      className={`${view === 'account' ? ' inset-0 bg-primary-800' : 'backdrop-blur-[5px] inset-0'} fixed  z-10 grid place-items-center`}
    >
      {children}
    </div>
  );
}

export default Overlay;
