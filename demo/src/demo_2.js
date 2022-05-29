import React, { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("useEffect");
    const jsx = (
      <div>
        <span>xixi</span>
      </div>
    )
    console.log(jsx, 'jsx');
  }, []);
  return (
    <div
      onClick={() => {
        setCount(count + 1);
      }}
    >
      {count}
    </div>
  );
}
