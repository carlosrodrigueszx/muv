import { useState } from "react";
import type { SubmitEvent } from "react";

import { FaClipboardUser } from "react-icons/fa6";
import { LuUserRoundCheck } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import DriversListItem from "../../components/DriversListItem.tsx";

// Interface que representa o modelo de dados que vem do Banco de Dados / API
interface Motorista {
  id: number;
  nome: string;
  cnh: string;
  telefone: string;
  foto: string;
  avaliacao_media: number;
  email: string;
}

export default function Drivers() {
  // Lista de motoristas cadastrados
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);

  // Estados dos inputs do formulário
  const [inputNome, setInputNome] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputCPF, setInputCPF] = useState("");
  const [inputTel, setInputTel] = useState("");
  const [inputCNH, setInputCNH] = useState("");
  const [inputCatCNH, setInputCatCNH] = useState("");
  const [inputValidityCNH, setInputValidyCNH] = useState("");

  const saveDriver = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

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
          <form onSubmit={saveDriver} className="grid grid-cols-4 gap-[16px]">
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
              <label htmlFor="cnh-validity">Validade da Habilitação</label>
              <input
                type="date"
                id="cnh-validity"
                name="cnh-validity"
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

      <div id="drivers-list" className="text-center">
        {motoristas.length === 0 ? (
          <p>Nenhum motorista cadastrado ainda.</p>
        ) : (
          motoristas.map((motorista) => (
            <DriversListItem catCNH={motorista.cnh} />
          ))
        )}
      </div>
    </>
  );
}
