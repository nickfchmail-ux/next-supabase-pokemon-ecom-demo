function Overlay({ children }) {
  return (
    <div
      className={`backdrop-blur-[5px] fixed inset-0 z-10 grid place-items-center`}
    >
      {children}
    </div>
  );
}

export default Overlay;
