/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de despesas cadastradas no banco via requisição GET
  --------------------------------------------------------------------------------------
*/
const getListaDespesa = async () => {
    let url = 'http://127.0.0.1:5000/lista_despesas';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        data.despesas.forEach(item => insertList(item.nome, item.quantidade, item.valor))  
        document.getElementById("idTotalConta").value = data.total_gasto
        atualizaResultado()   
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getListaDespesa()
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputDespesa, inputQuantidade, inputValor) => {
    const formData = new FormData();
    formData.append('nome', inputDespesa);
    formData.append('quantidade', inputQuantidade);
    formData.append('valor', inputValor);
  
    let url = 'http://127.0.0.1:5000/inclui_despesa';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => {
        if (response.status === 200)
          insertList(inputDespesa, inputQuantidade, inputValor)
          atualizaResultado()
          alert("Despesa " + inputDespesa + " adicionada!")        
          response.json()
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const nomeItem    = div.getElementsByTagName('td')[0].innerHTML
        const despesaDel  = parseInt(div.getElementsByTagName('td')[1].innerHTML) * parseFloat(div.getElementsByTagName('td')[2].innerHTML)

        if (confirm("Você tem certeza que deseja excluir a despesa " + nomeItem + " ?")) {
          // div.remove()
          deleteItem(nomeItem, despesaDel,div)          
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE pelo nome
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (item, despesaDel, div) => {
    console.log(item)
    let url = 'http://127.0.0.1:5000/deleta_por_nome?nome=' + item;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => {
        if (response.status === 200)
          console.log('return 200')
          div.remove()
          var totalConta  =  parseFloat(document.querySelector('#idTotalConta').value) - despesaDel
          document.getElementById("idTotalConta").value = totalConta.toFixed(2)
          alert("Despesa removida!")
          atualizaResultado()
          response.json()
        })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com nome, quantidade e valor 
    --------------------------------------------------------------------------------------
  */
  const newDespesa = () => {
    let inputDespesa = document.getElementById("newDespesa").value;
    let inputQuantidade = document.getElementById("newQuantidade").value;
    let inputValor = document.getElementById("newValor").value;
  
    if (inputDespesa === '') {
      alert("Escreva o nome de uma despesa!");
    } else if (isNaN(inputQuantidade) || isNaN(inputValor)) {
      alert("Quantidade e valor precisam ser números!");
    } else {
      postItem(inputDespesa, inputQuantidade, inputValor)
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (nomeDespesa, quantidade, valor) => {
    
    /* Inserindo a nova despesa na tabela de despeas */
    var item = [nomeDespesa, quantidade, valor, (quantidade * valor).toFixed(2)]
    var table = document.getElementById('listaDespesa');
    var row = table.insertRow();
    
    /* Atualizando o valor total das despesas com a nova despesa adicionada */

    var totalConta  =  parseFloat(document.querySelector('#idTotalConta').value)
    var despesaNova =  parseFloat(quantidade * valor)

    document.getElementById("idTotalConta").value = (totalConta + despesaNova).toFixed(2)

    /* incluindo o botom de exclusão para na linha da nova despesa */
   
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }

    insertButton(row.insertCell(-1))
    document.getElementById("newDespesa").value = "";
    document.getElementById("newQuantidade").value = "";
    document.getElementById("newValor").value = "";
  
    removeElement()
  }

  /*
  ----------------------------------------------------------------------------------------
  Função para atualizar o valor do Resultado sendo a dvisão entre o total conta e o total 
  de pagantes
  -----------------------------------------------------------------------------------------
  */

  const atualizaResultado = () => {  
     var totalConta  =  parseFloat(document.querySelector('#idTotalConta').value)
     var numPagantes =  parseInt(document.querySelector('#idPagante').value) 
     document.getElementById("idResultado").value = (totalConta/numPagantes).toFixed(2)
  } 

  /*
    --------------------------------------------------------------------------------------
    Função para buscar uma Despesa pelo seu nome e retornar o seu valor total
    --------------------------------------------------------------------------------------
  */
    const buscaNome = () => {
      let nomeDespesa = document.getElementById("idBuscaNome").value;
    
      if (nomeDespesa === '') {
        alert("Escreva o nome de uma despesa!");
      } 
      else {
        alert(nomeDespesa) 
        buscaDespesa(nomeDespesa)      
      }
    }
    
 const buscaDespesa = (nomeDespesa) => {
      let url = 'http://127.0.0.1:5000/despesa_por_nome?nome=' + nomeDespesa;
      fetch(url, {
        method: 'get'
      })
      .then((response) => response.json())
        .then((data) => {
            var totalDespesa = data.quantidade * data.valor
            document.getElementById("idvalorDespesa").value = totalDespesa.toFixed(2)          
        })         
      .catch((error) => {
        console.error('Error:', error);
      });
    } 
  