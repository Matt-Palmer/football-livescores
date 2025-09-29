type Props = {
  type_id: number;
};

function Card({ type_id }: Props) {
  const getCardType = () => {
    if (type_id === 19) {
      return (
        <span className="flex justify-center items-center border-[1px] bg-yellow-400 rounded-full h-[15px] w-[15px]"></span>
      );
    }

    if (type_id === 20) {
      return (
        <span className="flex justify-center items-center border-[1px] bg-red-600 rounded-full h-[15px] w-[15px]"></span>
      );
    }

    return (
      <span className="relative h-[15px] w-[23px]">
        <span
          className={`h-[15px] w-[15px] border-[1px] absolute rounded-full bg-yellow-400`}
        ></span>
        <span
          className={`h-[15px] w-[15px] border-[1px] absolute translate-x-1/2 rounded-full bg-red-600`}
        ></span>
      </span>
    );
  };

  return getCardType();
}

export default Card;
