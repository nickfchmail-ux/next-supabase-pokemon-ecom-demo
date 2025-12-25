"use client";

function Error({ error, reset }) {
  return (
    <div>
      Something went wrong
      <h1 className="">{error.message}</h1>
    </div>
  );
}

export default Error;
