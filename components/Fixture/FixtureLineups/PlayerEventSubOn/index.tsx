import { FaArrowAltCircleUp } from "react-icons/fa";

type Props = {
  classNames: string;
};

function LineupSubOn({ classNames }: Props) {
  return (
    <span
      className={`flex justify-center items-center w-[15px] h-[15px] bg-white text-red-600
        rounded-full border-[1px]`}
    >
      <FaArrowAltCircleUp className={classNames ? classNames : "w-5 h-5"} />
    </span>
  );
}

export default LineupSubOn;
