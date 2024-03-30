import React, { useState } from "react";

type Props = {};

function Segment({value}: {value: boolean}) {
  return (<div className="w-6 h-10 bg-green-400 rounded-sm border border-[#30dda4]" />);
}

export default function UmpkIoOutput({}: Props) {
  const [value, setValue] = useState<boolean[]>(new Array(8).fill(false));
  
  return (
    <div className="flex flex-row gap-1 px-2 py-2 bg-slate-800 justify-center rounded">
      {value?.map((x, i) => (<Segment value={x} key={i}/>))}
    </div>
    
  );
}
