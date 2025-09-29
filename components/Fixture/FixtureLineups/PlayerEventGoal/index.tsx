import { BiFootball } from "react-icons/bi";

type Props = {
  type_id?: number;
  classNames?: string;
};

function Goal({ type_id }: Props) {
  return (
    <span
      className={`flex justify-center items-center w-[15px] h-[15px] ${
        type_id === 15 ? "bg-red-600" : "bg-green-600"
      } rounded-full border-[1px]`}
    >
      <BiFootball className={`w-full h-full`} />
    </span>
  );
}

export default Goal;
