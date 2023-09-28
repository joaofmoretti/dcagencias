let codigoCliente = 0;
        let ultimocCliente = 0;
        let primeiroCliente = 0;
        let codigoAnterior = 0;
        let codigoPosterior = 0;
        let clienteAtual = null;
        let novoCliente = false;
        let token = '';

        function buscaTokenUsuario() {
            fetch('/user/getUserToken/', {
                method: 'get',
                headers: {"Token": token}              
               
            }).then((res) => res.json())
                .then((data) =>  {
                    token = data.token;
                  
                })
                .catch((err) => console.log(err));
        }
       // buscaTokenUsuario();

        function primeiro() {
            buscaPrimeiroCliente();
            codigoCliente = primeiroCliente;
            carregaCliente();
        }

        function ultimo() {
            buscaUltimoCodigoCliente();
            codigoCliente = ultimocCliente;
            carregaCliente();
        }

        function salvar() {

            clienteAtual.nome = document.getElementById('nome').value;
            clienteAtual.regiao = document.getElementById('regiao').value;
            clienteAtual.parceiro = document.getElementById('parceiro').value;
            clienteAtual.nps = document.getElementById('nps').value;

            clienteAtual.varejo = document.getElementById('varejo').value;
            clienteAtual.logistica = document.getElementById('logistica').value;
            clienteAtual.fabrica = document.getElementById('fabrica').value;
            clienteAtual.contrucao = document.getElementById('construcao').value;

            clienteAtual.b2b = document.getElementById('b2b').value;
            clienteAtual.b2c = document.getElementById('b2c').value;
            clienteAtual.b2b2c = document.getElementById('b2b2c').value;
            clienteAtual.b2b2b = document.getElementById('construcao').value;
            clienteAtual.marketplace = document.getElementById('marketplace').value;


            let method = "PUT";
            let endereco = '/api/v1/clientes/' + codigoCliente;

            if (novoCliente) {
                method = "POST";
                endereco = '/api/v1/clientes/';
            }

           var myHeaders = new Headers();
            myHeaders.append("Token", token);
            myHeaders.append("Content-Type", "application/json");

            

            var raw = JSON.stringify(clienteAtual);

            var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {

                        console.log("data");
                        console.dir(data);

                        if (novoCliente) {
                            codigoCliente = data.id;
							$toast("Agência alterada com sucesso", "#FF9100");
                        } else {
							$toast("Agência salva com sucesso", "#FF9100");
						}

                        setTimeout(carregaCliente(), 2000);
                        let navegacao = document.getElementById('navegacao');
                        let edicao = document.getElementById('edicao');
                        navegacao.style.visibility = 'visible';
                        edicao.style.visibility = 'hidden';
                       
                    })
                    .catch((err) => {$toast("Erro ao salvar Agência " + err, "#FF9100"); console.dir(err);});

        }

        function eliminaCliente() {

            $confirm("Você confirma a Exclusão desta Agencia?", "#FF9100")
            .then(() => {
                console.log("vai deletar o: " + codigoCliente);
                fetch('/api/v1/clientes/' + codigoCliente , {
                    method: 'delete',
                    headers: {"Token": token}               
                
                }).then((res) => res.json())
                    .then((data) => {
                        $alert("Cliente Eliminado!");
                        buscaUltimoCodigoCliente();
                        buscaPrimeiroCliente();
                        codigoCliente = data;    
                        carregaCliente();
                    })
                    .catch((err) => console.log(err));
            });        
        }

        

        function buscaUltimoCodigoCliente() {
            fetch('/api/v1/clientes/ultimo', {
                method: 'get',
                headers: {"Token": token}              
               
            }).then((res) => res.json())
                .then((data) => {
                    ultimocCliente = data;
                })
                .catch((err) => console.log(err));
        }
        //buscaUltimoCodigoCliente();

        function buscaPrimeiroCliente() {
            
            fetch('/api/v1/clientes/primeiro/', {
                method: 'get',
                headers: {"Token": token}               
               
            }).then((res) => res.json())
                .then((data) => {
                    primeiroCliente = data;
                })
                .catch((err) => console.log(err));
        }
        //buscaPrimeiroCliente();
        

        function proximo() {
            if (codigoPosterior != null) {
                codigoCliente = codigoPosterior;
                carregaCliente();
            }
            
        }

        function anterior() {

            if (codigoAnterior != null) {
                codigoCliente = codigoAnterior;
                carregaCliente();
            }

        }

        function buscaCliente() {
            return new Promise((resolve, reject) => {
                fetch('http://localhost:5001/api/v1/clientes/' + codigoCliente,
                {   method : 'get',
                    headers: {"Token": token}})
                    .then(res => res.json())
                    .then(data => {
                        resolve(data);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
            });
        }
        function carregaCliente() {
            console.log('carregaCliente codigoCliente ' + codigoCliente);
            if (codigoCliente == 0) {
                buscaPrimeiroCliente();
                codigoCliente = primeiroCliente; 
            }

            console.log('carregaCliente depois codigoCliente ' + codigoCliente);

            buscaCliente().then(cliente => {
                clienteAtual = cliente;
                console.log("Cliente");
                console.log(cliente);

                let campoNome = document.getElementById('nome');
                campoNome.value = cliente.nome;
                campoNome.disabled = true;

                let camponps = document.getElementById('nps');
                camponps.value = cliente.nps;
                camponps.disabled = true;

                let campoparceiro = document.getElementById('parceiro');
                campoparceiro.value = cliente.parceiro;
                campoparceiro.disabled = true;

                let campoRegiao = document.getElementById('regiao');
                campoRegiao.value = cliente.regiao;
                campoRegiao.disabled = true;

                let campovarejo = document.getElementById('varejo');
                campovarejo.checked = cliente.varejo;
                campovarejo.disabled = true;
                
                /*let campodistribuicao = document.getElementById('distribuicao');
                campodistribuicao.checked = cliente.distribuicao;
                campodistribuicao.disabled = true;*/

                let campologistica = document.getElementById('logistica');
                campologistica.checked = cliente.logistica;
                campologistica.disabled = true;

                let campoconstrucao = document.getElementById('construcao');
                campoconstrucao.checked = cliente.construcao;
                campoconstrucao.disabled = true;

                let campob2b = document.getElementById('b2b');
                campob2b.checked = cliente.b2b;
                campob2b.disabled = true;

                let campob2c = document.getElementById('b2c');
                campob2c.checked = cliente.b2c;
                campob2c.disabled = true;

                let campob2b2c = document.getElementById('b2b2c');
                campob2b2c.checked = cliente.b2b2c;
                campob2b2c.disabled = true;

                let campob2b2b = document.getElementById('b2b2b');
                campob2b2b.checked = cliente.b2b2b;
                campob2b2b.disabled = true;

                let campomarketplace = document.getElementById('marketplace');
                campomarketplace.checked = cliente.marketplace;
                campomarketplace.disabled = true;


                if (cliente.prev != null) {
                    codigoAnterior = cliente.prev;
                } else {
                    codigoAnterior = null;
					$toast("Você está na primeira agência", "#FF9100");
                }

                
                if (cliente.next != null) {
                    codigoPosterior = cliente.next;
                } else {
                    codigoPosterior = null;
					$toast("Você está na última agencia", "#FF9100");
                }
                novoCliente = false;
                                
            }).catch(error => { console.log(error);
                throw('Cliente inexistente com este código ' + codigoCliente);
          });

        }

        function modificar() {
                let campoNome = document.getElementById('nome');
                campoNome.disabled = false;

                let camponps = document.getElementById('nps');
                camponps.disabled = false;

                let campoparceiro = document.getElementById('parceiro');
                campoparceiro.disabled = false;

                let campoRegiao = document.getElementById('regiao');
                campoRegiao.disabled = false;

                let navegacao = document.getElementById('navegacao');
                let edicao = document.getElementById('edicao');

                let campovarejo = document.getElementById('varejo');
                campovarejo.disabled = false;
        
                let campologistica = document.getElementById('logistica');
                campologistica.disabled = false;

                let campoconstrucao = document.getElementById('construcao');
                campoconstrucao.disabled = false;

                let campob2b = document.getElementById('b2b');
                campob2b.disabled = false;

                let campob2c = document.getElementById('b2c');
                campob2c.disabled = false;

                let campob2b2c = document.getElementById('b2b2c');
                campob2b2c.disabled = false;

                let campob2b2b = document.getElementById('b2b2b');
               campob2b2b.disabled = false;

                let campomarketplace = document.getElementById('marketplace');
                campomarketplace.disabled = false;



                navegacao.style.visibility = 'hidden';
                edicao.style.visibility = 'visible';
        }
        

        function adicionar() {
                let campoNome = document.getElementById('nome');
                campoNome.value = '';
                campoNome.disabled = false;

                let camponps = document.getElementById('nps');
                camponps.value = '';
                camponps.disabled = false;

                let campoparceiro = document.getElementById('parceiro');
                campoparceiro.value = '';
                campoparceiro.disabled = false;

                let campoRegiao = document.getElementById('regiao');
                campoRegiao.value = '';
                campoRegiao.disabled = false;

                let campovarejo = document.getElementById('varejo');
                campovarejo.disabled = false;
        
                let campologistica = document.getElementById('logistica');
                campologistica.disabled = false;

                let campoconstrucao = document.getElementById('construcao');
                campoconstrucao.disabled = false;

                let campob2b = document.getElementById('b2b');
                campob2b.disabled = false;

                let campob2c = document.getElementById('b2c');
                campob2c.disabled = false;

                let campob2b2c = document.getElementById('b2b2c');
                campob2b2c.disabled = false;

                let campob2b2b = document.getElementById('b2b2b');
               campob2b2b.disabled = false;

                let campomarketplace = document.getElementById('marketplace');
                campomarketplace.disabled = false;




                let navegacao = document.getElementById('navegacao');
                let edicao = document.getElementById('edicao');

                navegacao.style.visibility = 'hidden';
                edicao.style.visibility = 'visible';
                novoCliente = true;
        }


        function cancelar() {
            carregaCliente();
            let navegacao = document.getElementById('navegacao');
            let edicao = document.getElementById('edicao');

            navegacao.style.visibility = 'visible';
            edicao.style.visibility = 'hidden';
        }