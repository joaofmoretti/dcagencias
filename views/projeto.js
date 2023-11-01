       
        

        let token = '';
        let agenciaSugerida = null;
        let proximaAgencia = 1;

   

       function voltar() {
        $('#resultado').fadeOut(500);
        sleep(500).then(() => { $('#formulario').fadeIn(500); })
       }



        function outraAgencia() {
            
               let method = "GET";
               let endereco = '/api/v1/sugestaoagencia/nome/' + document.getElementById('nome').value + '/next/' + proximaAgencia++;
         

           var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");

            

            

            var requestOptions = {
            method: method,
            headers: myHeaders,
            
            redirect: 'follow'
            };

            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {

                        console.log("data");
                        console.dir(data);
                        //$('#agencia')[0].value = data.nome;   

                        agenciaSugerida = data;

                        $('#agencia').html('<b>Agência escolhida: </b><a href="' + data["Site Agência "] + '"/>' + data["Nome Agência "] +'</a>');
                        $('#responsavel').html('<b>Responsavel: </b>' + data["Nome responsável "] );
                  
                    })
                    .catch((err) => {$confirm("Esta é a última agência disponível para teste projeto", "#E74C3C"); proximaAgencia=0; console.dir(err);});

        }
        

        function salvar() {
            let cliente = {id: 0, 
                nome: document.getElementById('nome').value,
                
                segmento: document.getElementById('segmento').value,
                agencia: document.getElementById('agenciapref').value,
               
                b2b: document.getElementById('b2b').checked,
                b2c: document.getElementById('b2c').checked,
                D2C: document.getElementById('D2C').checked,
                Omni: document.getElementById('Omni').checked,
                marketplace:document.getElementById('marketplace').checked,
                shopifyplus:document.getElementById('certificacao').checked,
                next: 1};

                
                $('#formulario').fadeOut(500);
                if ($('#resultado')[0].style.display != 'none') {
                    $('#resultado').hide();
                }
        

       
               let method = "POST";
               let endereco = '/api/v1/sugestaoagencia/';
         

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
                    //$('#agencia')[0].value = data.nome;   

                    agenciaSugerida = data;

                    $('#agencia').html('<b>Agência escolhida: </b><a href="' + data["Site Agência "] + '"/>' + data["Nome Agência "] +'</a>');
                    $('#responsavel').html('<b>Responsavel: </b>' + data["Nome responsável "] );
                    sleep(500).then(() => { $('#resultado').fadeIn(500); });
                   
                    

                    
                   
					//$toast("Agência recomendada para o projeto: " + data.nome  , "#FF9100");
                       

                       
                      
                       
                       
                    })
                    .catch((err) => {$confirm("Não foi possível encontrar agências para este projeto", "#E74C3C"); console.dir(err);});

        }

        function saveProject() {
            
        

       
               let method = "POST";
               let endereco = '/api/v1/projeto/';
         

           var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");

            agenciaSugerida.cliente = $("#nome")[0].value;

            var raw = JSON.stringify(agenciaSugerida);

            var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {

                                         
                    

                    
                   
					$toast("Projeto confirmado", "#FF9100");
                       

                       
                      
                       
                       
                    })
                    .catch((err) => {$confirm("Erro ao salvar projeto", "#E74C3C"); console.dir(err);});

        }

        function carregarAgencias() {
            
        

       
            let method = "get";
            let endereco = '/api/v1/agencias/nomes/';
      

             var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");

         

         
         var requestOptions = {
         method: method,
         headers: myHeaders,
         
         redirect: 'follow'
         };

         fetch(endereco , requestOptions).then((res) => res.json())
                 .then((data) => {

                                      
                    let dropdown = document.getElementById('agenciapref');
                    let option;
    
                    for (let i = 0; i < data.length; i++) {
                        option = document.createElement('option');
                        option.style.color = "black";
                        option.text = data[i];
                        option.value = data[i];
                        dropdown.add(option);
                    }
                    
                 })
                 .catch((err) => {$confirm("Ocorreu um problema ao tentar carregar agências", "#E74C3C"); console.dir(err);});

     }

        
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
        

