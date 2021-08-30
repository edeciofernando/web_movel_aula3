import React, { useState } from 'react'
import { useForm } from "react-hook-form";

const AppBody = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const [lista, setLista] = useState([]);

  const onSubmit = (data, e) => {
    console.log(data);

    // se houver dados salvos em localStorage, obtém esses dados (senão, vazio)
    const carros = localStorage.getItem("carros")
      ? JSON.parse(localStorage.getItem("carros"))
      : "";

    // salva em localstorage os dados existentes, acrescentando o preenchido no form                    
    localStorage.setItem("carros", JSON.stringify([...carros, data]));

    // atualiza a lista
    setLista([...lista, data]);

    // pode-se limpar cada campo
//    setValue("modelo", "");

    // ou, então, limpar todo o form
    e.target.reset();
  }

  // obtém o ano atual
  const ano_atual = new Date().getFullYear();

  return (
    <div className="row">
      <div className="col-sm-3">
        <img
          src="herbie.jpg"
          alt="Revenda Herbie"
          className="img-fluid mx-auto d-block"
        />
      </div>

      <div className="col-sm-9 mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Modelo:</span>
            </div>
            <input
              type="text"
              className="form-control"
              {...register("modelo", {
                required: true,
                minLength: 2,
                maxLength: 30
              })}
              autoFocus
            />
            <div className="input-group-prepend">
              <span className="input-group-text">Marca:</span>
            </div>
            <select
              className="form-control"
              {...register("marca", {
                required: true
              })}
            >
              <option value="">-- Selecione a Marca --</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Fiat">Fiat</option>
              <option value="Ford">Ford</option>
              <option value="Renault">Renault</option>
              <option value="Volkswagen">Volkswagen</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Ano:</span>
            </div>
            <input
              type="number"
              className="form-control"
              {...register("ano", {
                required: true,
                min: ano_atual - 30,
                max: ano_atual + 1
              })}
            />
            <div className="input-group-prepend">
              <span className="input-group-text">Preço R$:</span>
            </div>
            <input
              type="number"
              className="form-control"
              {...register("preco", {
                required: true,
                min: 5000,
                max: 100000
              })}
            />
            <div className="input-group-append">
              <input
                type="submit"
                className="btn btn-primary"
                value="Adicionar"
              />
            </div>
          </div>
        </form>
        <div
          className={
            (errors.modelo || errors.marca || errors.ano || errors.preco) &&
            "alert alert-danger"
          }
        >
          {errors.modelo && (
            <span>Modelo deve ser preenchido (até 30 caracteres); </span>
          )}
          {errors.marca && <span>Marca deve ser selecionada; </span>}
          {errors.ano && (
            <span>
              Ano deve ser preenchido (entre {ano_atual - 30} e {ano_atual + 1}
              );
            </span>
          )}
          {errors.preco && (
            <span>Preço deve ser preenchido (entre 5000 e 100000); </span>
          )}
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Modelo do Veículo</th>
              <th>Marca</th>
              <th>Ano</th>
              <th>Preço R$</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((carro) => {
              return (
                <tr key={carro.modelo}>
                  <td>{carro.modelo}</td>
                  <td>{carro.marca}</td>
                  <td>{carro.ano}</td>
                  <td>{carro.preco}</td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppBody;