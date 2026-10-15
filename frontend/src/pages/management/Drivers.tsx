import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";

import { FaClipboardUser } from "react-icons/fa6";
import { LuUserRoundCheck, LuEye, LuEyeClosed } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import DriversListItem from "../../components/DriversListItem.tsx";

// Interface que representa o modelo de dados que vem do Banco de Dados / API
interface Motorista {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  email: string;
  telefone: string;
  // foto: string;
  avaliacao_media: number;
}

export default function Drivers() {
  // Lista de motoristas cadastrados
  const [driversArray, setDriversArray] = useState<Motorista[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [driversError, setDriversError] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const response = await fetch("/api/motoristas", {
          credentials: "same-origin",
        });
        if (!response.ok) throw new Error("Não foi possível carregar os motoristas.");
        setDriversArray(await response.json());
      } catch {
        setDriversError("Não foi possível carregar os motoristas do servidor.");
      } finally {
        setLoadingDrivers(false);
      }
    };
    void loadDrivers();
  }, []);

  // Estados dos inputs do formulário
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputCPF, setInputCPF] = useState("");
  const [inputCNH, setInputCNH] = useState("");
  const [inputTel, setInputTel] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");

  // Estados para controlar a visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados dos input de busca e ordenação
  const [inputSearch, setInputSearch] = useState("");
  const [selectOrder, setSelectOrder] = useState("nome-az");

  const filteredDrivers = useMemo(() => {
    return driversArray
      .filter((driver) => {
        const term = inputSearch.toLowerCase();

        return (
          driver.nome.toLowerCase().includes(term) ||
          driver.cnh.startsWith(term)
        );
      })
      .sort((a, b) => {
        if (selectOrder === "nome-az") {
          return a.nome.localeCompare(b.nome); // Ordem Alfabética (A-Z)
        }
        if (selectOrder === "nome-za") {
          return b.nome.localeCompare(a.nome); // Ordem Inversa (Z-A)
        }
        if (selectOrder === "cnh") {
          return a.cnh.localeCompare(b.cnh); // Ordena por string numérica da CNH
        }
        return 0;
      });
  }, [driversArray, inputSearch, selectOrder]);

  const saveDriver = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    driversArray.forEach((e) => {
      console.log(e);
    });

    if (inputPassword != inputConfirmPassword) {
      alert("As senhas inseridas são diferentes.");
      return;
    }

    const checkDuplicated = driversArray.filter(
      (e) => e.nome === inputName || e.cnh === inputCNH || e.cpf === inputCPF,
    );

    if (checkDuplicated.length === 0) {
      try {
        const csrfResponse = await fetch("/api/auth/csrf", {
          credentials: "same-origin",
        });
        if (!csrfResponse.ok) {
          throw new Error("Não foi possível iniciar a sessão segura. Atualize a página e tente novamente.");
        }
        const csrf: { headerName: string; token: string } = await csrfResponse.json();
        const response = await fetch("/api/motoristas", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-type": "application/json",
            [csrf.headerName]: csrf.token,
          },
          body: JSON.stringify({
            nome: inputName,
            cpf: inputCPF,
            cnh: inputCNH,
            email: inputEmail,
            telefone: inputTel,
            senha: inputPassword,
          }),
        });

        if (response.ok) {
          const newDriver: Motorista = await response.json();
          setDriversArray([...driversArray, newDriver]);
          alert("Motorista cadastrado com sucesso.");

          // Limpando campos do formulário
          setInputName("");
          setInputEmail("");
          setInputCPF("");
          setInputCNH("");
          setInputTel("");
          setInputPassword("");
          setInputConfirmPassword("");
        } else if (response.status === 401) {
          alert("Entre na sua conta em /login antes de cadastrar um motorista.");
        } else if (response.status === 403) {
          alert("Sua sessão de segurança expirou. Atualize a página e tente novamente.");
        } else {
          const message = await response.text();
          alert(message || "Ocorreu um erro ao salvar o motorista no banco.");
        }
      } catch (error) {
        console.log("Erro na requisição:", error);
        alert(error instanceof Error ? error.message : "Não foi possível conectar ao servidor.");
      }
    } else {
      alert("Informações inválidas.");
    }
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
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                placeholder="Ex: Francisco Martins Oliveira"
                value={inputName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputName(e.target.value)
                }
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                placeholder="Ex: motorista1@email.com"
                value={inputEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputEmail(e.target.value)
                }
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="cpf">CPF do Titular</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                maxLength={11}
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                placeholder="Ex: 123.456.789-01"
                value={inputCPF}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputCPF(e.target.value)
                }
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="phone-number">Número para Contato</label>
              <input
                type="tel"
                id="phone-number"
                name="phone-number"
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                placeholder="Ex: (88) 99090-7070"
                value={inputTel}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputTel(e.target.value)
                }
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="cnh-value">N° Registro CNH</label>
              <input
                type="text"
                id="cnh-value"
                name="cnh-value"
                maxLength={11}
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                placeholder="Ex: 01234567890"
                value={inputCNH}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputCNH(e.target.value)
                }
                required
              />
            </div>
            <div className="form-field relative">
              <label htmlFor="password">Senha de Acesso</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Senha de acesso ao sistema do motorista"
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                value={inputPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setInputPassword(value);
                  if (value === "") {
                    setShowPassword(false);
                  }
                }}
                required
              />
              {inputPassword.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 bottom-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <LuEye className="cursor-pointer" />
                  ) : (
                    <LuEyeClosed className="cursor-pointer" />
                  )}
                </button>
              )}
            </div>
            <div className="form-field relative">
              <label htmlFor="password-confirm">Confirmar Senha</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password-confirm"
                name="password-confirm"
                placeholder="Confirme a senha de acesso"
                className="bg-secondary-gray p-[8px] rounded-lg w-full border border-solid border-gray-300"
                value={inputConfirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setInputConfirmPassword(value);
                  if (value === "") {
                    setShowConfirmPassword(false);
                  }
                }}
                required
              />
              {inputConfirmPassword.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 bottom-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <LuEye className="cursor-pointer" />
                  ) : (
                    <LuEyeClosed className="cursor-pointer" />
                  )}
                </button>
              )}
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
              className="bg-secondary-gray p-[8px] pl-[32px] rounded-lg w-full border border-solid border-gray-300"
              placeholder="Buscar por nome, CPF ou CNH"
              value={inputSearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputSearch(e.target.value)
              }
            />
            <IoSearch className="absolute bottom-[12px] left-[8px] text-secondary-dark-gray" />
          </div>
          <select
            name=""
            id=""
            className="bg-secondary-gray p-[8px] rounded-lg w-md border border-solid border-gray-300"
            value={selectOrder}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSelectOrder(e.target.value)
            }
          >
            <option value="nome-az">Nome (A-Z)</option>
            <option value="nome-za">Nome (Z-A)</option>
            <option value="cnh-order">CNH (Crescente)</option>
          </select>
        </form>
      </div>

      <div id="drivers-list" className="text-center flex flex-col gap-4">
        {filteredDrivers.length === 0 ? (
          loadingDrivers ? <p>Carregando motoristas…</p> :
          driversError ? <p role="alert">{driversError}</p> :
          <p>Nenhum motorista cadastrado ainda.</p>
        ) : (
          filteredDrivers.map((driver) => (
            <DriversListItem
              driverName={driver.nome}
              valueCNH={driver.cnh}
              valueCPF={driver.cpf}
              telNumber={driver.telefone}
              driverImage={""}
              driverEmail={driver.email}
            />
          ))
        )}
      </div>
    </>
  );
}
