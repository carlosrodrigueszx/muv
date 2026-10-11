import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";
import {
  PiCalendarCheckBold,
  PiClockCounterClockwiseFill,
} from "react-icons/pi";
import { FaRegAddressCard } from "react-icons/fa6";
import { LuEye } from "react-icons/lu";
import { RiPencilLine } from "react-icons/ri";

interface DriversListItemProps {
  driverName: string;
  catCNH: string;
  valueCNH: string;
  validityCNH: string;
  telNumber: string;
  driverEmail: string;
  driverImage: string;
}

export default function DriversListItem({
  driverName,
  catCNH,
  valueCNH,
  validityCNH,
  telNumber,
  driverEmail,
  driverImage,
}: DriversListItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-md flex p-6 items-center">
      <div className="driver-data flex w-full gap-5">
        <div className="driver-image rounded-2xl bg-secondary-gray h-20 w-20">
          <img src={driverImage} alt="driver-pfp" />
        </div>
        <div className="driver-info">
          <h2 className="driver-name text-primary font-bold text-xl">
            {driverName}
            Carlos Daniel Cavalcante
          </h2>
          <ul>
            <li className="flex items-center gap-2">
              <FaRegAddressCard
                size={18}
                className="text-secondary-dark-gray"
              />
              CNH Cat.{" "}
              <span className="driver-cnh-type font-semibold">{catCNH} </span>
              Reg.:{" "}
              <span className="driver-cnh-value font-semibold">{valueCNH}</span>
            </li>
            <li className="flex items-center gap-2">
              <PiCalendarCheckBold
                size={18}
                className="text-secondary-dark-gray"
              />
              Validade:{" "}
              <span className="driver-cnh-validity font-semibold">
                {validityCNH}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineLocalPhone
                size={18}
                className="text-secondary-dark-gray"
              />
              <span className="driver-tel font-semibold">{telNumber}</span>
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineEmail size={18} className="text-secondary-dark-gray" />
              <span className="driver-email font-semibold">{driverEmail}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="driver-quick-actions flex w-m h-fit gap-2">
        <button className="bg-secondary-gray cursor-pointer px-[16px] py-[8px] rounded-lg flex gap-[6px] items-center font-semibold">
          <LuEye />
          Prontuário
        </button>
        <button className="bg-secondary-gray cursor-pointer px-[16px] py-[8px] rounded-lg flex gap-[6px] items-center font-semibold">
          <PiClockCounterClockwiseFill />
          Viagens
        </button>
        <button className="bg-primary text-white cursor-pointer px-[16px] py-[8px] rounded-lg flex gap-[6px] items-center font-semibold">
          <RiPencilLine />
          Editar
        </button>
      </div>
    </div>
  );
}
