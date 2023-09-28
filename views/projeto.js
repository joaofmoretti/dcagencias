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
            let cliente = {id: 0, 
                nome: document.getElementById('nome').value,
                regiao: document.getElementById('regiao').value,
                segmento: document.getElementById('segmento').value,
                agencia: document.getElementById('segmento').value,
                custo: document.getElementById('custo').value,
                complexidade: document.getElementById('complexidade').value,
                visitas: document.getElementById('visitas').checked,
                servicos: document.getElementById('servicos').checked,
                splitpagamento: document.getElementById('splitpagamento').checked,
                portal: document.getElementById('portal').checked,
                kits: document.getElementById('kits').checked,
                integracao: document.getElementById('integracao').checked,
                b2b: document.getElementById('b2b').checked,
                b2c: document.getElementById('b2c').checked,
                b2b2c: document.getElementById('b2b2c').checked,
                b2b2b: document.getElementById('b2b2c').checked,
                marketplace:document.getElementById('marketplace').checked,
                next: 1};

            


        

       
               let method = "POST";
               let endereco = '/api/v1/projeto/';
         

           var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");

            

            var raw = JSON.stringify(cliente);

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

                    
					$toast("Agência recomendada para o projeto: " + data.nome  , "#FF9100");
                       

                       
                      
                       
                       
                    })
                    .catch((err) => {$confirm("Agência recomendada: Buda Digital ", "#E74C3C"); console.dir(err);});

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