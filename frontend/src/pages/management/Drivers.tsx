import { FaClipboardUser } from "react-icons/fa6";
import { LuUserRoundCheck } from "react-icons/lu";

export default function Drivers() {
  return (
    <main className="bg-secondary">
      <div className="page-title">
        <h1 className="font-semibold text-primary text-3xl">
          Gestão de Motoristas
        </h1>
      </div>

      <div
        id="driver-register-form"
        className="bg-white shadow-md rounded-xl p-[24px]"
      >
        <div className="form-title flex gap-[8px] items-center">
          <div className="bg-primary p-[8px] w-fit rounded-lg text-white">
            <FaClipboardUser size={20} />
          </div>
          <h2 className="font-semibold text-primary text-xl">
            Cadastro de Condutor
          </h2>
        </div>
        <div className="form-inputs">
          <form action="/" method="post">
            <input
              type="text"
              id="complete-name"
              name="complete-name"
              className="bg-secondary-gray p-[8px] rounded-lg"
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              className="bg-secondary-gray p-[8px] rounded-lg"
            />
            <input
              type="number"
              id="cpf"
              name="cpf"
              className="bg-secondary-gray p-[8px] rounded-lg"
            />
            <input
              type="tel"
              id="phone-number"
              name="phone-number"
              className="bg-secondary-gray p-[8px] rounded-lg"
            />
            <input
              type="number"
              id="cnh-value"
              name="cnh-type"
              className="bg-secondary-gray p-[8px] rounded-lg"
              required
            />
            <select
              name="chn-type"
              id="cnh-type"
              className="bg-secondary-gray p-[8px] rounded-lg"
              required
            >
              <option value="B">Categoria B</option>
              <option value="D">Categoria D</option>
            </select>
            <input
              type="date"
              id="cnh-valid-date"
              name="cnh-valid-date"
              className="bg-secondary-gray p-[8px] rounded-lg"
              required
            />
            <button
              type="submit"
              className="flex px-[24px] py-[12px] gap-[8px] bg-primary rounded-lg text-white items-center font-semibold cursor-pointer"
            >
              <LuUserRoundCheck size={20} />
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
