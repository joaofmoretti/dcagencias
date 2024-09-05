       
        

        let token = '';
        let agenciaSugerida = null;
        let projeto = null;
        let proximaAgencia = 1;
        let filadeAgencias = [];

        function setSFforB2B() {

            if ($("#b2b")[0].checked) {
                $("#certificacao").prop( "checked", true );
                $("#certificacao").prop("disabled", true );
            } else {
                $("#certificacao").prop("disabled", false );
            }

        }
   

       function voltar() {
        $('#classificacao').hide();
        $('#filaagencias').hide();
        $('#resultado').fadeOut(200);
        sleep(200).then(() => { $('#formulario').fadeIn(200); })
       }

       function voltarparaResultado() {
       
        $('#classificacao').fadeOut(200);
        sleep(200).then(() => { $('#resultado').fadeIn(200); })
       }

       function mostrarClassificacao() {
        $('#resultado').fadeOut(200);
        
        sleep(200).then(() => { $('#classificacao').fadeIn(200); })
       }

       function mostrarFilaAgencias() {
        $('#formulario').fadeOut(200);
        
        sleep(200).then(() => { $('#filaagencias').fadeIn(200); })
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

                        alert(agenciaSugerida);


                        $('#agencia').html('<b>Agência escolhida: </b><a href="' + agenciaSugerida["Site Agência"] + '"/>' + agenciaSugerida["Nome Agência"] +'</a>');
                        $('#responsavel').html('<b>Responsavel: </b>' + agenciaSugerida["Nome responsável"] );
                  
                    })
                    .catch((err) => {$confirm("Esta é a última agência disponível para teste projeto", "#E74C3C"); proximaAgencia=0; console.dir(err);});

        }
        

        function sugerirAgenciaSite() {
            if(!validateForm()) return;
            projeto = {
                site: document.getElementById('site').value,
                
                
                };

                
                $('#formulario').fadeOut(200);
                if ($('#resultado')[0].style.display != 'none') {
                    $('#resultado').hide();
                }
        

       
               let method = "POST";
               let endereco = '/api/v1/sugeriragencia/';
         

           var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");

            

            var raw = JSON.stringify(projeto);

            var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {
                        $("#btConfirma").show();
                        $("#btOutraAgencia").show();
                        
                        console.log("data");
                        console.dir(data);
                    //$('#agencia')[0].value = data.nome;   

                    agenciaSugerida = data;

                    $('#agencia').html('<b>Agência escolhida: </b><a href="' + data["Site Agência "] + '"/>' + data["Nome Agência"] +'</a>');
                    $('#responsavel').html('<b>Responsavel: </b>' + data.responsavel );
                    sleep(200).then(() => { $('#resultado').fadeIn(200); });
                   
                    carregaClassifica();

                    
                   
					//$toast("Agência recomendada para o projeto: " + data.nome  , "#FF9100");
                       

                       
                      
                       
                       
                    })
                    .catch((err) => {$confirm("Não foi possível encontrar agências para este projeto", "#E74C3C"); console.dir(err);});

        }

        function validateForm() {
           let allok = true;
           if ($('#nome').val() == '') {
            $('#divnomecliente').css('border-bottom', '1px solid #ed0f0f');
            $('#nome').attr("placeholder", "Informe o nome do cliente do projeto");
            allok = false;
           } else {
            $('#nome').attr("placeholder", "Nome do Cliente");
            $('#divnomecliente').css('border-bottom', '1px solid #ccc');
           }

           if ($('#segmento').val() == '') {
            $('#divsegmento').css('border-bottom', '1px solid #ed0f0f');
            $('#segmento option:first').text('Informe o segmento de atuação do cliente');
            allok = false;
           } else {
            $('#divsegmento').css('border-bottom', '1px solid #ccc');
            $('#segmento option:first').text('Segmento');
           }
           return allok;
        }


        function saveProject() {

           


            $("#btConfirma").hide();
            $("#btOutraAgencia").hide();

       
               let method = "POST";
               let endereco = '/api/v1/projeto/';
         

           var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");

            //agenciaSugerida.cliente = $("#nome")[0].value;
            projeto.agencia = agenciaSugerida["Nome Agência"];
            projeto.score = agenciaSugerida.score;
            projeto.dataSolicitacao = new Date();

            var raw = JSON.stringify(projeto);

            var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {

                                         
                    

                    
                   
					$toast("Projeto confirmado", "#FF9100");
                       

                    document.getElementById('nome').value = '';
                
                    document.getElementById('segmento').selectedIndex = 0;
                    document.getElementById('agenciapref').selectedIndex = 0;
                   
                    document.getElementById('b2b').checked = false;
                    document.getElementById('b2c').checked = false;
                    document.getElementById('D2C').checked = false;
                    document.getElementById('Omni').checked = false;
                    document.getElementById('marketplace').checked = false;
                    document.getElementById('certificacao').checked = false;
                      
                       
                       
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

    function carregaFila() {
               let method = "get";
        let endereco = '/api/v1/agencias/homologadas';
        var myHeaders = new Headers();
        myHeaders.append("Token", '');
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
                method: method,
                headers: myHeaders,
                
                redirect: 'follow'
            };
        let tableBody = $("#fila tbody"); 
        fetch(endereco , requestOptions).then((res) => res.json())
                .then((data) => {

              

                    let mudouFila = !(JSON.stringify(filadeAgencias) == JSON.stringify(data));
                   

                    if (mudouFila) {

                        filadeAgencias = data;
                        tableBody.empty();
                        for (let i = 0; i < filadeAgencias.length; i++) {
                        
                            let codlinha = '<tr><td align="center"><div class="mb-2" style="color:white;">' + (i+1) + '</div></td><td align="center"><div class="mb-2" style="color:white;">' + filadeAgencias[i]['Nome Agência'] + ' </div></td></tr>' ;
                            tableBody.append(codlinha);    
                            
                        }

                    }
                    
                })
                .catch((err) => console.log(err));
        }
        
        function carregaClassifica() {
            let method = "post";
            let endereco = '/api/v1/sugeriragencia/classificacao/';
            projeto = {
                site: document.getElementById('site').value,
                
                
                };
            var myHeaders = new Headers();
            myHeaders.append("Token", '');
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify(projeto);

            var requestOptions = {
                    method: method,
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
            let tableBody = $("#classificados tbody"); 
            fetch(endereco , requestOptions).then((res) => res.json())
                    .then((data) => {

                

                        let mudouFila = !(JSON.stringify(filadeAgencias) == JSON.stringify(data));
                        

                        if (mudouFila) {


                            console.log('filadeAgencias.length  ' + filadeAgencias.length);
                            filadeAgencias = data;
                            tableBody.empty();
                            for (let i = 0; i < filadeAgencias.length; i++) {
                                console.log(filadeAgencias[i]);
                                let codlinha = '<tr><td align="center"><div class="mb-2" style="color:white;">' + (i+1) + 
                                '</div></td><td align="center"><div class="mb-2" style="color:white;">' + filadeAgencias[i]['Nome Agência'] + 
                                ' </div></td><td align="center"><div class="mb-2" style="color:white;">' + filadeAgencias[i].score + '</div></td></tr>' ;
                                tableBody.append(codlinha);    
                                
                            }

                        }
                        
                    })
                    .catch((err) => console.log(err));
            }

