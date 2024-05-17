import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import Image from "next/image";

const MessageInit = ({ data: { label } }: NodeProps<{ label: string }>) => {
  return (
    <section
      className="text-black rounded-lg shadow-xl"
      onClick={() => console.log("hello")}
    >
      <Handle type="target" position={Position.Left} />

      <div className="bg-[#b5efe3] rounded-t-lg  flex justify-between items-center p-1">
        <div className="flex justify-center items-center">
          <Image src="/images/message.svg" width={8} height={8} alt="message" />
          <p className="text-[8px] font-bold px-1">Send Message</p>
        </div>
        <Image
          className="ml-5"
          src="/images/whatsapp.png"
          width={10}
          height={10}
          alt="message"
        />
      </div>
      <div className="bg-white text-start text-[8px] font-normal rounded-b-lg p-2">
        {label}
      </div>
      <Handle type="source" position={Position.Right} />
    </section>
  );
};

export default MessageInit;
