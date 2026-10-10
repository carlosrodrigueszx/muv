import { FaClipboardUser } from "react-icons/fa6";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";

export default function Drivers() {
  return (
    <>
      <div className="page-title">
        <h1 className="font-semibold text-primary text-3xl">
          Gestão de Motoristas
        </h1>
      </div>

      <div
        id="driver-register-form"
        className="bg-white shadow-md rounded-xl p-[24px] gap-[8px]"
      >
        <div className="form-title flex gap-[8px] items-center mb-3">
          <div className="bg-primary p-[8px] w-fit rounded-lg text-white">
            <FaClipboardUser size={20} />
          </div>
          <h2 className="font-semibold text-primary text-xl">
            Cadastro de Condutor
          </h2>
        </div>
        <div className="form-inputs">
          <form
            action="/"
            method="post"
            className="grid grid-cols-4 gap-[16px]"
          >
            <div className="form-field col-span-2">
              <label htmlFor="complete-name">Nome Completo</label>
              <input
                type="text"
                id="complete-name"
                name="complete-name"
                maxLength={255}
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
              />
            </div>
            <div className="form-field">
              <label htmlFor="cpf">CPF do Titular</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                maxLength={11}
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone-number">Número para Contato</label>
              <input
                type="tel"
                id="phone-number"
                name="phone-number"
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
              />
            </div>
            <div className="form-field">
              <label htmlFor="cnh-value">N° Registro CNH</label>
              <input
                type="text"
                id="cnh-value"
                name="cnh-value"
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="cnh-type">Categoria CNH</label>
              <select
                name="chn-type"
                id="cnh-type"
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
                required
              >
                <option value="B">Categoria B</option>
                <option value="D">Categoria D</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="cnh-valid-date">Validade da Habilitação</label>
              <input
                type="date"
                id="cnh-valid-date"
                name="cnh-valid-date"
                className="bg-secondary-gray p-[8px] rounded-lg w-full"
                required
              />
            </div>
            <div className="form-field col-span-2 col-start-2 justify-items-center">
              <button
                type="submit"
                className="flex px-[24px] py-[12px] gap-[8px] bg-primary rounded-lg text-white items-center font-semibold cursor-pointer"
              >
                <LuUserRoundCheck size={20} />
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        id="drivers-search-field"
        className="bg-white rounded-xl shadow-md p-[16px]"
      >
        <form action="" className="flex gap-[24px]">
          <div className="input-search-field relative w-full">
            <input
              type="search"
              name=""
              id=""
              className="bg-secondary-gray p-[8px] pl-[32px] rounded-lg w-full"
              placeholder="Buscar por nome, CPF ou CNH"
            />
            <IoSearch className="absolute bottom-[12px] left-[8px] text-secondary-dark-gray" />
          </div>
          <select
            name=""
            id=""
            className="bg-secondary-gray p-[8px] rounded-lg w-md"
          >
            <option value="">Nome (A-Z)</option>
            <option value="">CNH (0-9)</option>
          </select>
        </form>
      </div>
    </>
  );
}
