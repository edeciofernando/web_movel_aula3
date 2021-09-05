import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import "./table.css";

const AppBody = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const [lista, setLista] = useState([]);
  const [alterar, setAlterar] = useState(false);
  const [data_id, setData_id] = useState(0);

  const onSubmit = (data, e) => {

    // acrescenta um novo atributo aos dados enviados a partir do formulário
    data.id = new Date().getTime();
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
    setValue("modelo", "");
    setValue("marca", "");
    setValue("ano", "");
    setValue("preco", "");

    // ou, então, limpar todo o form
    // contudo, esse reset() não limpa o conteúdo das variáveis (ou seja, se o usuário
    // clicar 2x sobre o adicionar, irá duplicar o registro)
//    e.target.reset();
  }

  // obtém o ano atual
  const ano_atual = new Date().getFullYear();

  // "efeito colateral", ocorre quando a página é carregada
  useEffect(() => {
    setLista(localStorage.getItem("carros")
      ? JSON.parse(localStorage.getItem("carros"))
      : []);
  }, []); 

  const handleClick = e => {
    // obtém a linha da tabela sobre a qual o usuário clicou, ou seja, qual elemento tr foi clicado
    const tr = e.target.closest("tr");

    // console.log(e.target);
    // console.log(tr);
    // console.log(tr.getAttribute("data-id"));  
    
    const id = Number(tr.getAttribute("data-id"));
    
    if (e.target.classList.contains("fa-edit")) {      
      // console.log("Alterar");

      // atribui a cada variável do form, o conteúdo da linha clicada
      setValue("modelo", tr.cells[0].innerText);
      setValue("marca", tr.cells[1].innerText);
      setValue("ano", tr.cells[2].innerText);
      setValue("preco", tr.cells[3].innerText);

      setAlterar(true);
      setData_id(id);

    } else if (e.target.classList.contains("fa-minus-circle")) {
      // console.log("Excluir");

      // obtém o modelo da linha sobre a qual o usuário clicou
      const modelo = tr.cells[0].innerText;

      if (window.confirm(`Confirma a exclusão do veículo "${modelo}"?`)) {
        // aplica um filtro para recuperar todas as linhas, exceto aquela que será excluída
        const novaLista = lista.filter((carro) => {return carro.id !== id});

        // atualiza o localStorage
        localStorage.setItem("carros", JSON.stringify(novaLista));

        // atualiza a tabela (refresh)
        setLista(novaLista);
      }
    }
  }

  const onUpdate = data => {
    // inicialmente, recupera os dados salvos em localStorage
    const carros = JSON.parse(localStorage.getItem("carros"));

    // cria um novo array vazio
    const carros2 = [];

    for (const carro of carros) {
      if (carro.id === data_id) {
        data.id = data_id;
        carros2.push(data);   // os dados do form (alterados) + data.id
      } else {
        carros2.push(carro);
      }
    }

    // atualiza os dados em localStorage (com os dados de carros2)
    localStorage.setItem("carros", JSON.stringify(carros2));

    // atualiza a lista (para fazer um refresh na página)
    setLista(carros2);

    setValue("modelo", "");
    setValue("marca", "");
    setValue("ano", "");
    setValue("preco", "");

    setAlterar(false);
  }

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
        <form onSubmit={alterar ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
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
                className={alterar ? "d-none" : "btn btn-primary"}
                value="Adicionar"
              />
              <input
                type="submit"
                className={alterar ? "btn btn-success" : "d-none"}
                value="Alterar"
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
                <tr key={carro.id}
                    data-id={carro.id}
                    onClick={handleClick}>
                  <td>{carro.modelo}</td>
                  <td>{carro.marca}</td>
                  <td>{carro.ano}</td>
                  <td>{carro.preco}</td>
                  <td>
                    <i className="far fa-edit text-success mr-2" title="Alterar"></i>
                    <i className="fas fa-minus-circle text-danger" title="Excluir"></i>
                  </td>
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