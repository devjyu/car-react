import { ScaleLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      {/* <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> */}
      <ScaleLoader
        // color="#C44D63"
        color="#D9534F"
        height={25}
        speedMultiplier={1}
        width={13}
      />
    </div>
  );
};

export default Loader;
