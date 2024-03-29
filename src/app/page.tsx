"use client"

import Image from 'next/image'

import { listen } from '@tauri-apps/api/event'
import { appWindow } from "@tauri-apps/api/window"
import { invoke } from "@tauri-apps/api/tauri";

import { useEffect, useState } from 'react'

type DisplaySegmentProps = {
  value: boolean[],
}

const SevenSegmentDisplay = (props: DisplaySegmentProps) => {
  const displayStates = props.value;
  const segments = [
    displayStates[0] ?
      <polygon
        className='fill-slate-50'
        id='v_top-left'
        points='47.0,90.0  50.0,87.0  53.3,90.0  53.3,93.0  47.3,97.0 43.3,97.0 47.0,93.0'
      /> : null,
    displayStates[2] ?
      <polygon
        className='fill-slate-50'
        id='v_top-left'
        points='3,4.6 0,9.6 0,39.4 3,44.4 6.1,39.4 6.1,9.6'
      /> : null,
    displayStates[3] ?
      <polygon
        className='fill-slate-50'
        id='v_bottom-left'
        points='3,48.1 0,53.1 0,82.8 3,87.8 6.1,82.8 6.1,53.1'
      /> : null,
    displayStates[7] ?
      <polygon
      className='fill-slate-50'
        id='h_top'
        points='4.8,3 9.8,6.1 39.5,6.1 44.5,3 39.5,0 9.8,0'
      /> : null,
    displayStates[1] ?
      <polygon
      className='fill-slate-50'
        id='h_middle'
        points='4.8,46.2 9.8,49.3 39.5,49.3 44.5,46.2 39.5,43.2 9.8,43.2'
      /> : null,
    displayStates[4] ?
      <polygon
      className='fill-slate-50'
        id='h_bottom'
        points='4.8,89.7 9.8,92.7 39.5,92.7 44.5,89.7 39.5,86.6 9.8,86.6'
      /> : null,
    displayStates[6] ?
      <polygon
      className='fill-slate-50'
        id='v_top-right'
        points='46.3,4.6 49.3,9.6 49.3,39.4 46.3,44.4 43.2,39.4 43.2,9.6'
      /> : null,
    displayStates[5] ?
      <polygon
      className='fill-slate-50'
        id='v_bottom-right'
        points='46.3,48.1 49.3,53.1 49.3,82.8 46.3,87.8 43.2,82.8 43.2,53.1'
      /> : null
  ];

  return (
    <div className='block w-full'>
      <figure className='p-2 bg-slate-800 w-16'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 53.3 97.7' preserveAspectRatio='xMidYMid meet'>
          {segments}
        </svg>
      </figure>
    </div>
  );
}

type TypePayload = {
  digit: number[]
  pg: number,
}

const UmpkDisplay = () => {
  const [data, setData] = useState([0, 0, 0, 0, 0, 0]);
  const [pg, setPg] = useState(0);

  useEffect(() => {
    console.log("JS Meow");

    const unlisten = listen('PROGRESS', (event) => {
      const pay = event.payload as TypePayload;

      setData(pay.digit);

      setPg(pay.pg);
    })

    return () => {
      unlisten.then(f => f());
    }
  }, [])

  const valueToList = (n, b=8) => [...Array(b)].map((x,i)=>(n>>i)&1).reverse();

  return (
  <div className='flex flex-col'>
    <div className='flex flex-row'>
      <div className='flex flex-row'>
        <SevenSegmentDisplay value={valueToList(data[0])}/>
        <SevenSegmentDisplay value={valueToList(data[1])}/>
        <SevenSegmentDisplay value={valueToList(data[2])}/>
        <SevenSegmentDisplay value={valueToList(data[3])}/>
      </div>
      <div className='flex flex-row ml-4'>
        <SevenSegmentDisplay value={valueToList(data[4])}/>
        <SevenSegmentDisplay value={valueToList(data[5])}/>
      </div>
    </div>
    <h1 className='text-slate-100 w-full text-center'>{pg.toString(16).padStart(4, '0')}</h1>
  </div>
  )
}


export default function Home() {
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By GalaxyShad
          </a>
        </div>
      </div>

      <UmpkDisplay/>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={async () => {
            await invoke("start_umpk80", {
              window: appWindow,
            });
          }}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Run{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Let's Rock
          </p>
        </a>
      </div>
    </main>
  )
}
