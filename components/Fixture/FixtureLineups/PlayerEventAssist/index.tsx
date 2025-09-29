import { GiRunningShoe } from "react-icons/gi";

type Props = {
  classNames?: string;
};

function Assist({ classNames }: Props) {
  return (
    <span
      className={`flex justify-center items-center w-[15px] h-[15px] rounded-full bg-blue-600 border-[1px] p-[2px]`}
    >
      <GiRunningShoe />
    </span>
  );
}

export default Assist;
