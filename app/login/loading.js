import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <div className="backdrop-blur-md bg-transparent flex justify-center items-center h-full w-full">
      <CircularProgress className="place-items-center" />
    </div>
  );
}
