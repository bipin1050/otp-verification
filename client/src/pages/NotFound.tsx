import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-4 flex flex-col items-center gap-5 justify-center h-screen text-violet-950">
      <h1 className="text-9xl font-semibold xl:text-[10rem">404</h1>
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-3xl font-medium">
          The page you were looking for doesn’t exist
        </h1>
        <p className="font-normal text-[1.1rem] underline underline-offset-4">
          <Link to={"/"}>Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
}
