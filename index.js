let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');
const cors = require('cors');

let mapaAgenciaClient = new Map();

let app = express();

let campoToken = "Token";
let segredo = '';

let dados = require('./views/AgenciasParceiras.json');

let agenciasHomologadas = dados.agencias.filter(aga => aga["Homologado TOTVS "].toLowerCase().trim() == 'homologado');

let nomeAgencias = [];

for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
    nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência ']);
    agenciasHomologadas[ca].posicaoFila = ca+1;
    if (agenciasHomologadas[ca].qtProj == undefined) {
        agenciasHomologadas[ca].qtProj = 0;
    } 
    
    agenciasHomologadas[ca].qtCases = contaCases(agenciasHomologadas[ca]['Nome Agência ']);
    
}

const { application } = require('express');
const { json } = require('body-parser');
const { throws } = require('assert');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/views/form.html'));
app.use(express.static(__dirname + '/views/agenciasfila.html'));
app.use(express.static(__dirname + '/views/cadastroagencia.html'));
app.use(express.static(__dirname + '/views/cadastroprojetos.html'));
app.use(express.static(__dirname + '/views/styleforms.css'));
app.use(express.static(__dirname + '/views/form.js'));
app.use(express.static(__dirname + '/views/libs/tabulator.min.css'));
app.use(express.static(__dirname + '/views/libs/tabulator.min.js'));
app.use(express.static(__dirname + '/views/libs/luxon.min.js'));


app.use(express.static(__dirname + '/views/login.html'));
app.use(express.static(__dirname + '/views/stylelogin.css'));

let router = express.Router();
app.use("/form/",router);
app.use("/login/",router);
app.use("/projeto/",router);
app.use(("/agencias/", router))
app.use(("/projetos/", router))
let encodeUrl = bodyParser.urlencoded({ extended: false });

let projetos = []

// Inicio Integração RD
let webhookbody;
let webhookresponse;

app.get('/webhook/response/', (req, res) => {

  res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(webhookresponse));
  //res.sendFile(__dirname + '/views/login.html');
}); 

app.get('/webhook/', (req, res) => {

  res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(webhookbody));
  //res.sendFile(__dirname + '/views/login.html');
}); 

function retornaApresentador(json) {

    let mail = json.payload.scheduled_event.event_memberships[0].user_email
    
    let usersRD = [
      {
        "id": "6361707267edf7001b72b4c7",
        "name": "Fernando Gordilho",
        "email": "fernando.gordilho@totvs.com.br"
  
      },
  
      {
        "id": "63514b20a7e955000c0ece48",
        "name": "Ruan Fagundes",
        "email": "ruan.fagundes@totvs.com.br"
  
      },
      {
        "id": "637671145c04e200168f1de9",
        "name": "João Moretti",
        "email": "joao.moretti@fluig.com"
      },
      {
        "id": "62db0782987f1a000c1c86c3",
        "name": "Jhon",
        "email": "jhonatans.aguiar@totvs.com.br"
      }
    ];
  
  
    return usersRD.find((u) => u.email == mail);
  
  }

async function obtemObjetoEmpresa(nome) {
      let nomeEmpresa = nome;
      console.log('nomeEmpresa ' + nomeEmpresa);
      return new Promise((resolve, reject) => {
      
      let url = 'https://crm.rdstation.com/api/v1/organizations?token=6303f05b46f5b6001b61b603';
      let opcoesEmpresa = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({organization: {name: nomeEmpresa}})
      };
    
      fetch(url, opcoesEmpresa)
      .then(res => res.json())
      .then(empresa => { if (empresa.errors != undefined && empresa.errors.name == 'Valor já existente.') {throw new Error()} 
                             else {
                             console.log("empresa nova criada");
                             resolve(empresa)
                             }})
      .catch((error) => {
        let opcoesBuscaEmpresa = {
          method: 'GET',
          headers: {accept: 'application/json', 'content-type': 'application/json'},
          
        };
  
        let urlBuscaEmpresa = 'https://crm.rdstation.com/api/v1/organizations?token=6303f05b46f5b6001b61b603&q='
             + nomeEmpresa + '&limit=200';
  
        fetch(urlBuscaEmpresa, opcoesBuscaEmpresa)
        .then(res => res.json())
        .then(empresasLocalizadas => { console.log("Empresas: " + empresasLocalizadas.organizations.length);
                                       let empresa = empresasLocalizadas.organizations.find((emp) => emp.name == nomeEmpresa); 
                                       
                                       //console.log("nova empresa"); console.log(empresa) 
                                       if (empresa == null) {empresa = empresasLocalizadas.organizations.filter((emp) => emp.name.toLowerCase().indexOf(nomeEmpresa) > -1)[0]}
                                      // if (empresa == null) {console.log("Deu coco")} else {console.log(empresa)}
                                      resolve(empresa);
                                       
                                      })
        .catch((Error) => {console.log("Nao criou nem achou"); reject(Error);})                               

      }).catch(erroEmpresa => {console.log("Erro na parada"); 
                             console.log(erroEmpresa)
                             reject(erroEmpresa);
                            
                            })
    })                        
}

app.post('/webhook/', encodeUrl, (requisicao, resposta) => {
  console.log("webhoook------------------------------------------")
  console.log(requisicao.body);
  webhookbody = requisicao.body;
  
  let nomeEmpresa = requisicao.body.payload.questions_and_answers.find((q) => q.question == 'Empresa').answer;
  let escopo = requisicao.body.payload.questions_and_answers.find((q) => q.position == 4).answer;
  let apresentador = retornaApresentador(requisicao.body);
  let origem = requisicao.body.payload.questions_and_answers.find((q) => q.position == 6).answer
  let telefoneCliente = requisicao.body.payload.questions_and_answers.find((q) => q.question == 'Celular do Cliente').answer;
  let nomeCliente = requisicao.body.payload.questions_and_answers.find((q) => q.position == 1).answer;
  let nomeUnidade = requisicao.body.payload.questions_and_answers.find((q) => q.position == 5).answer;
  let oferta = requisicao.body.payload.scheduled_event.name.toUpperCase().trim().replace('E-COMMERCE B2B', '');
  let cargoCliente = requisicao.body.payload.questions_and_answers.find((q) => q.position == 3).answer;
  let campaingId = '6532c91f3ae6b1000de593a5';
  let sourceId = '63651c290de1b20019712080';
  let emailRequisitante = requisicao.body.payload.email.toString().toLowerCase();
  let fonteRD = (origem == "RD STATION");
  let nomeAPN;
  let codigoEtapaFunilRD = '651f23bc471bcb000d59202c';
  let idUserOportunidade = apresentador.id;
  let nameUserOportunidade = apresentador.name;

 console.debug("origem: " + origem);

  if (origem == "RD CONVERSAS") {
    sourceId = '6557bdc659db5d001c3c4684';
  } else if (origem == "EXACT SALES") {
    sourceId = '6557bdb23770f2001bb8b82e';
  } else if (origem == "TOTVS") {
    sourceId = '63651c290de1b20019712080';
  } else if (origem == "RD STATION") {
    sourceId = '6556783ed1f311000f84c37c';
  } else if (origem == "AGÊNCIAS") {
    sourceId = '6557bdb93770f2001bb8b83f';
  }

 

  if (fonteRD) {

    nomeAPN = "Joyce Santos";
    codigoEtapaFunilRD = "6335b2d8e9137a0014b0dc24";
    idUserOportunidade = "635036d5a4137d0017eb6f34"
    nameUserOportunidade = "Joyce Santos";

    //emailRequisitante = "Joyce Santos";
      
      /*if (emailRequisitante == 'jonathan.lopes@rdstation.com') {
        nomeAPN = 'Jonathan Lopes (RD)';
      } else if (emailRequisitante == 'gabriela.cidade@rdstation.com') {
        nomeAPN = 'Gabriela Cidade (RD)';
      } else if (emailRequisitante == 'gabriel.calixto@rdstation.com') {
        nomeAPN = 'Gabriel Calixto (RD)';
      }*/
  } 
    

  let promessaEmpresa = obtemObjetoEmpresa(nomeEmpresa);

  promessaEmpresa.then(empresa => {
    
    console.log(empresa);
    let conteudobody = {
      campaign: {_id: campaingId},
      deal: {
        deal_stage_id: codigoEtapaFunilRD, 
        name: oferta + ' - ' + nomeEmpresa,
        rating: 2,
        user_id: idUserOportunidade, // Aqui é a Joyce se for RD
        deal_custom_fields: [
          {custom_field_id: '63763ae8c62c24000cbc1032', value: oferta},
          {custom_field_id: '63505233968a250014767d55', value: nomeUnidade},
          {custom_field_id: '63ced2631bc670000ca81466', value: nomeAPN},
          //{custom_field_id: '6544fe33f62610000d22077d', value: requisicao.body.payload.name}, // nome do responsavel trocar pela joyce
          {custom_field_id: '641b4c5dba8773002266f528', value: new Date(requisicao.body.payload.scheduled_event.start_time).toLocaleDateString('pt-BR')},
          {custom_field_id: '63f8ced05edf4300218e297f', value: apresentador.name} // Aqui também.
    
        ]
      },
      deal_source: {_id: sourceId},
      organization: {_id: empresa._id},
      contacts: [
        {
          //emails: [{email: requisicao.body.payload.email}],
          name: nomeCliente,
          title: cargoCliente,
          phones: [{type: 'cellphone', phone: telefoneCliente}]
        }
      ]
    };

    if (origem != "TOTVS") {
      conteudobody.deal.deal_custom_fields.push({custom_field_id: '64cd438ff3fc640014b2f5a5', value: "N/A"});
      conteudobody.deal.deal_custom_fields.push({custom_field_id: '6474edfabb0aba000da1378f', value: "NÃO"});
    }

    let opcoesOPeCom = {
      method: 'POST',
      headers: {accept: 'application/json', 'content-type': 'application/json'}
    };

    opcoesOPeCom.body = JSON.stringify(conteudobody);

    
  console.log("O que ele vai enviar para o RD =================");
  console.log(opcoesOPeCom.body)
  console.log("fim dO que ele vai enviar para o RD =================");
    

    url = 'https://crm.rdstation.com/api/v1/deals?token=6303f05b46f5b6001b61b603';
    fetch(url, opcoesOPeCom)
    .then(res => res.json())
    .then(oportunidade => { 
          console.log("resposta ");
          console.log(oportunidade);
          webhookresponse = oportunidade;
          opcoesOPeCom.body = JSON.stringify({
                            activity: {
                              deal_id: oportunidade._id,
                              text: escopo,
                              user_id: idUserOportunidade
                            }});

          url = 'https://crm.rdstation.com/api/v1/activities?token=6303f05b46f5b6001b61b603';                 
          
          fetch(url, opcoesOPeCom)
          .then(res => res.json())
          .then(comentario => { console.log(comentario); resposta.status(201).send()})})
          .catch(err => {console.log(err);  webhookresponse = err});

    })
    .catch(err => { console.log(err); webhookresponse = err });
})
  
app.post('/mentorwebhook/', encodeUrl, (requisicao, resposta) => {
	
		console.log("mentor --------------------------------------------");
  console.log(requisicao.body);
  console.log("fim do body mentor --------------------------------------------");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwicHJvcGVydGllcyI6eyJrZXlJZCI6ImtleV8wMUhLV0RBNFpOWjJZMktaQTM5OVJWWk1LMSIsIndvcmtzcGFjZUlkIjoid3BjXzAxSEtTWVBOSEtIMDIzNzYwVkJXV1dOUlA3IiwidXNlcklkIjoidXNlcl9hcGkifSwiaWF0IjoxNzA0OTgxNzYzfQ.RYKjA9vaOUWg4RW4qX99wVs0brKs1dVpr0xA-6xJt_YpEC_0ohwWJ-stT0gNT2ahTMkjAl9qkBXF2Nk1c4Jy5wZ9otlcMAnkMlnJvmBw_eksrmKSUjKHpLVGQCMhQd8gT9QG0S0hPXwHzu7iNUWa7Fc0Ziwlkd43yCunScNkYVDBw0LeHsiSaiCmNyhKtutqzoQ_I09lXCaj7cjbLvPTFZUsdZoZcxmqf4ofVBAENo_0uBf3JWdNV27EDzdLsM6pWTRGR_Z5gWdINWhMyF56jq-b3WQz6UNbWJqnU3WAlxHMsRHGW3r8CDdp5OcU3m45InyY29HAWlxpZjOLmZa6oQ");
  
  var raw = JSON.stringify({
    "0": {
      "json": {
        "promptId": "question_answer",
        "data": {
          "question": requisicao.body.pergunta
        },
        "kbs": []
      }
    }
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  fetch("https://api.conteudo.rdstationmentoria.com.br/trpc/copywriting.create?batch=1", requestOptions)
    .then(response => response.text())
    .then(result => {//console.log(result)
		
		let resultMentor = JSON.parse(result);
		
		let respostaMentor = {
			"resposta": resultMentor[0].result.data.json.content
		}
		
		
		
      resposta.status(200).send(respostaMentor);
    
    } )
    .catch(error => {console.log('error', error) 
                    resposta.status(404).send(error); 
                     });




  
})
app.get('/ping', (req, res) => {
    console.log("ping " + req.ip);
    res.status(201).send("pong")
  })
// Fim Integração RD

app.get('/', (req, res) => {
    
    res.redirect('/projeto/');
    //res.sendFile(__dirname + '/views/form.html');
});  

app.get('/form/', (req, res) => {
    
    res.sendFile(__dirname + '/views/form.html');
});

app.get('/calc/', (req, res) => {
    
    res.sendFile(__dirname + '/views/calculadora.html');
});

app.get('/agencias/fila', (req, res) => {
    
    res.sendFile(__dirname + '/views/agenciasfila.html');
});

app.get('/agencias/consulta', (req, res) => {
    
    res.sendFile(__dirname + '/views/cadastroagencias.html');
});

app.get('/projetos/consulta', (req, res) => {
    
    res.sendFile(__dirname + '/views/cadastroprojetos.html');
});

app.get('/projeto/', (req, res) => {
    
    res.sendFile(__dirname + '/views/projeto.html');
});




app.post('/login/', encodeUrl, (requisicao, resposta) => {

    var usuario = requisicao.body.usuario;
    var senha = requisicao.body.senha;

    if (usuario == 'teste' && senha == 'teste') {
        segredo = senha;
        resposta.redirect('/form/');
        
    } else {
        resposta.send("<script>alert('Usuário ou senha inválidos!'); history.go(-1);</script>");
    }

    
});

app.get('/login/', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
}); 

    
app.get('/api/v1/agencias/nomes/', (req, res) => {
    
  

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(nomeAgencias));
}); 

app.post('/api/v1/agencias/dados/cadastrais', (req, res) => {
    
    let resultString = "Dados cadastrais de agencias parceiras atualizado com sucesso";
    let httpCode = 200;
    console.log("postando dados cadastrais das agencias a parceiras");
    //console.log(req.body);
    let dadosAntigos = {
        "agencias": [...dados.agencias]
    };
  
    try {
        dados.agencias  = [];
        dados.agencias  = req.body;
        agenciasHomologadas = [];


        agenciasHomologadas = dados.agencias.filter(aga => aga["Homologado TOTVS "].toLowerCase().trim() == 'homologado');
        
        
        nomeAgencias = [];
       
        
        for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
            nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência ']);
            let dadoAnterior = dadosAntigos.agencias.filter((da) => da['Nome Agência '].toLowerCase().trim() == agenciasHomologadas[ca]['Nome Agência '].toLowerCase().trim());
            agenciasHomologadas[ca].posicaoFila = ca+1;
            if (dadoAnterior != null) {
                if (dadoAnterior.qtProj != undefined) {
                    agenciasHomologadas[ca].qtProj = dadoAnterior.qtProj;
                } else {
                    agenciasHomologadas[ca].qtProj = 0;
                }
                if (dadoAnterior.score != undefined) {
                    agenciasHomologadas[ca].score = dadoAnterior.score;
                } else {
                    agenciasHomologadas[ca].score = 0;
                }
            } else {
                agenciasHomologadas[ca].score = 0;
                agenciasHomologadas[ca].qtProj = 0;
            }
        }
  
        fs.writeFile('./views/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) })  
    
    } catch (erro) {
        console.log(erro);
        resultString = "Erro ao atualizar dados das agências " + erro;
        httpCode = 500;
    }

    res.writeHead(httpCode, {"Content-Type": "application/json"});
    res.end(JSON.stringify(resultString));
});


app.post('/api/v1/agencias/dados/cases', (req, res) => {
    
    let resultString = "Cases de  agencias parceiras atualizado com sucesso";
    let httpCode = 200;
    console.log("postando dados de cases");
    console.log(req.body);
    
    try {
        dados['CASES POR AGÊNCIA '] = []
        dados['CASES POR AGÊNCIA '] = req.body;
        fs.writeFile('./views/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) }) 
        
    } catch (erro) {
        resultString = "Erro ao atualizar dados das agências " + erro;
        httpCode = 500;
    }

    res.writeHead(httpCode, {"Content-Type": "application/json"});
    res.end(JSON.stringify(resultString));
});

app.post('/api/v1/agencias/dados/', (req, res) => {
    
    let resultString = "Dados de agencias parceiras atualizado com sucesso";
    let httpCode = 200;
    console.log("postando dados das agencias");
    console.log(req.body);
    let dadosAntigos = []
    dadosAntigos.push(dados);

    try {
        dados = req.body;
        agenciasHomologadas = [];


        agenciasHomologadas = dados.agencias.filter(aga => aga["Homologado TOTVS "].toLowerCase().trim() == 'homologado');
        
        
        nomeAgencias = [];
        
        for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
            nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência ']);
            let dadoAnterior = dadosAntigos.agencias.filter((da) => da['Nome Agência '].toLowerCase().trim() == agenciasHomologadas[ca]['Nome Agência '].toLowerCase().trim());
            agenciasHomologadas[ca].posicaoFila = ca+1;
            if (dadoAnterior != null) {
                if (dadoAnterior.qtProj != undefined) {
                    agenciasHomologadas[ca].qtProj = dadoAnterior.qtProj;
                } else {
                    agenciasHomologadas[ca].qtProj = 0;
                }
                if (dadoAnterior.score != undefined) {
                    agenciasHomologadas[ca].score = dadoAnterior.score;
                } else {
                    agenciasHomologadas[ca].score = 0;
                }
            } else {
                agenciasHomologadas[ca].score = 0;
                agenciasHomologadas[ca].qtProj = 0;
            }

        }
        fs.writeFile('./views/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) }) 
    } catch (erro) {
        resultString = "Erro ao atualizar dados das agências " + erro;
        httpCode = 500;
    }

    res.writeHead(httpCode, {"Content-Type": "application/json"});
    res.end(JSON.stringify(resultString));
});

app.get('/api/v1/projetos/id/:id', (req, res) => {
    
    console.log("novo metodo projetos filtro ");
    console.log(req.params);
    console.log(req.params.id);
    
   let filtrados = projetos.filter((pro) => pro.id > req.params.id);

   console.log(filtrados)

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(filtrados));
});


app.get('/api/v1/projetos/', (req, res) => {
    
   

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(projetos));
});


app.get('/api/v1/agencias/cases', (req, res) => {
    
    //console.log(dados.agencias);
    
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(dados['CASES POR AGÊNCIA ']));
}); 



app.get('/api/v1/agencias/', (req, res) => {
    
    
   
    for (let ca =0; ca <  dados.agencias.length; ca++) {
        
        dados.agencias[ca].posicaoFila = agenciasHomologadas.indexOf(dados.agencias[ca])+1;
        if (dados.agencias[ca].qtProj == undefined) {
            dados.agencias[ca].qtProj = 0;
        } 
        if (dados.agencias[ca].score == undefined) {
            dados.agencias[ca].score = 0;
        }

        dados.agencias[ca].qtCases = contaCases(dados.agencias[ca]['Nome Agência ']);
       

    }

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(dados.agencias));
}); 

app.get('/api/v1/agencias/homologadas', (req, res) => {
    
   

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciasHomologadas));
}); 


app.get('/api/v1/sugestaoagencia/nome/:nome', (req, res) => {
   
    let agenciasdoCliente = mapaAgenciaClient.get(req.params.nome);
    let statusHttp = 200;
   

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciasdoCliente));

});


app.get('/api/v1/sugestaoagencia/nome/:nome/next/:next', (req, res) => {
   console.log("proxima agencia sugerida");
    let agenciasdoCliente = mapaAgenciaClient.get(req.params.nome);
    let next = Number.parseInt(req.params.next);

    console.log('next ' + next);
    let statusHttp = 200;

    let agenciaLocalizada = agenciasdoCliente[next];

    if (agenciaLocalizada == null) {
        statusHttp = 404;
    }

   

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciaLocalizada));

});

app.post('/api/v1/sugestaoagencia/', encodeUrl, (req, res) => {
	
	
    res.writeHead(200, {"Content-Type": "application/json"});
    let sugestao = req.body;
    console.log(sugestao);
    

    let agenciasSugeridas = [];
    

    console.log("agencias homologadas " + agenciasHomologadas.length);

    let agenciaPreferida;

    for (let iag = 0; iag < agenciasHomologadas.length; iag++) {
        let agenciaAvaliada = agenciasHomologadas[iag];
        
        

        if (!agenciaAvaliada["Homologado TOTVS "].toLowerCase().trim() == 'homologado') continue

        if (sugestao.shopifyplus && (agenciaAvaliada['Certificação Shopify '].toLowerCase().trim().indexOf('plus') == -1)) continue
        let nomeAgencia = agenciaAvaliada['Nome Agência '].toLowerCase().trim();
        
        let score = 0;

        if (sugestao.agenciapreferencial.trim() == '') {
            console.log('dados.pontuacao.Base ' + dados.pontuacao.base + ' iag  ' + iag + ' dados.pontuacao.MultiPosicaoFila ' + dados.pontuacao.MultiPosicaoFila);
            score =  dados.pontuacao.Base - (iag * dados.pontuacao.MultiPosicaoFila);
        } 


        if (agenciaAvaliada["Atuante na plataforma Shopify "] != undefined && agenciaAvaliada["Atuante na plataforma Shopify "].toLowerCase().trim() == 'sim') {

            
            score = score + dados.pontuacao.Atuanteshopify
        }

       
        
    

        if (agenciaAvaliada['Certificação Shopify '].toLowerCase().trim().indexOf('foundation')) {
            score = score + dados.pontuacao.certShopify;
        }

        if (agenciaAvaliada['Certificação Shopify '].toLowerCase().trim().indexOf('plus')) {
            score = score + dados.pontuacao.certShopifyPlus;

            if (sugestao.shopifyplus) {
                score = score + dados.pontuacao.projetoShopifyPlus;
            }
        }

       
        if (sugestao.agenciapreferencial.toLowerCase().trim() != '') {
            if (nomeAgencia.indexOf(sugestao.agenciapreferencial.toLowerCase().trim()) > -1) {
                console.log("nomeAgencia " + nomeAgencia + " sugestao " + sugestao.agenciapreferencial.toLowerCase().trim() + " " + nomeAgencia.indexOf(sugestao.agenciapreferencial.toLowerCase().trim()) );
                agenciaPreferida = agenciaAvaliada;
                score = score + dados.pontuacao.agenciaPreferencial;
            }
        } 

        let casesAG = dados["CASES POR AGÊNCIA "].filter(caso => caso['Agência:'].toLowerCase().trim().indexOf(nomeAgencia) > -1)
        let plataformCaseScore = 0
        let segmentoCaseScore = 0;
        let b2bCaseScore = 0;
        let b2cCaseScore = 0;
        let d2dCaseScore = 0;
        let marketplaceCaseScore = 0;
        let omniCaseScore = 0;
        
        agenciaAvaliada.qtCases = contaCases(nomeAgencia);
        
        for (let conta=0; conta < casesAG.length; conta++) {
            let caso = casesAG[conta];
            console.log(caso);
            if (caso["Segmento:"] != undefined) {
                if (caso["Segmento:"].toLowerCase().trim().indexOf(sugestao.segmento.toLowerCase().trim()) > -1) {
                    segmentoCaseScore = dados.pontuacao.caseSegmento;
                }

                if ((caso["Segmento:"].toLowerCase().trim().indexOf(sugestao.segmento.toLowerCase().trim()) > -1) && (caso['Plataforma do Case '].toLowerCase().indexOf("shopify") > -1)) {
                    plataformCaseScore = dados.pontuacao.caseSegmentoPlatafoma;
                }
            }
            

            if (caso['Modelos de negócios atendidos:'] != undefined) {
                let mercados = caso['Modelos de negócios atendidos:'].toLowerCase();
                if (sugestao.b2b && (mercados.indexOf('b2b') > -1)) {
                    b2bCaseScore =  dados.pontuacao.caseModeloNegocio;
                }

                if (sugestao.b2c && (mercados.indexOf('b2c') > -1)) {
                    b2cCaseScore = dados.pontuacao.caseModeloNegocio;
                }

              

                if (sugestao.d2c && (mercados.indexOf('d2c') > -1)) {
                    d2dCaseScore =  dados.pontuacao.caseModeloNegocio;
                }

                if (sugestao.marketplace && (mercados.indexOf('marketplace') > -1)) {
                   marketplaceCaseScore =  dados.pontuacao.caseModeloNegocio;
                }

                if (sugestao.Omni && (mercados.indexOf('omni') > -1)) {
                    omniCaseScore = dados.pontuacao.caseModeloNegocio;
                }

            }




        }
        score = score + plataformCaseScore + segmentoCaseScore + b2bCaseScore + b2cCaseScore + d2dCaseScore +marketplaceCaseScore + omniCaseScore;


        agenciaAvaliada.score = score - iag;
       // agenciaAvaliada.cliente = sugestao.nome;
        agenciasSugeridas.push(agenciaAvaliada);
    }

    agenciasSugeridas.sort((a, b) => (a.score < b.score ? 1 : -1));

    if (agenciaPreferida != null) {
        console.log("melhor: " + agenciasSugeridas[0]['Nome Agência '] + ' ' + agenciasSugeridas[0].score + " favorita: " + agenciaPreferida['Nome Agência '] + ' ' + agenciaPreferida.score);
        if (agenciasSugeridas[0].score > agenciaPreferida.score) {
            let porcentagem = 100 - ((agenciaPreferida.score * 100) / agenciasSugeridas[0].score);
            console.log("porcentagem " + porcentagem);
            if (porcentagem < dados.pontuacao.porcentagemAgenciaPreferencial) {

                let posicaoAtual = agenciasSugeridas.indexOf(agenciaPreferida);
                let posicaofinal = 0;
                console.log("Posicao da agencia preferida no ranking atual " + posicaoAtual);
                array_move(agenciasSugeridas, posicaoAtual, posicaofinal );

            }
        }
    }
    

    mapaAgenciaClient.set(sugestao.nome, agenciasSugeridas);

   

   console.log("primeira agencia sugerida como resposta");
    
   
    console.log(agenciasSugeridas[0]['Nome Agência '] + ' score ' + agenciasSugeridas[0].score);
    res.end(JSON.stringify(agenciasSugeridas[0]));

    

});

function contaCases(nomedaAgencia) {
    let nomeAgencia = nomedaAgencia.toLowerCase().trim();
	let casosdaAgencia = dados["CASES POR AGÊNCIA "].filter(caso => caso['Agência:'].toLowerCase().trim().indexOf(nomeAgencia) > -1);

    if (casosdaAgencia != null) {
        return casosdaAgencia.length;

    } else {
        return 0;
    }
}

app.get('/api/v1/score/', (req, res) => {
    let statusHttp = 200;
    
    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(dados.pontuacao));

});


app.get('/api/v1/projetos/', (req, res) => {
    let statusHttp = 200;
    
    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(projetos));

});

app.post('/api/v1/score/', (req, res) => {
    let statusHttp = 200;
    let newPontos = req.body;

    dados.pontuacao = newPontos;
    
    
    try {
        fs.writeFile('./views/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err)});
            res.writeHead(statusHttp, {"Content-Type": "application/json"});
        res.end(JSON.stringify("Pontuacao atualizadda com sucesso"));
     } catch (erro) {
     
        console.log(erro);
        res.writeHead(401, {"Content-Type": "application/json"});
            res.end(JSON.stringify(erro));
     }
    

});


app.post('/api/v1/projeto/', encodeUrl, (req, res) => {
	
	console.log("salvando o projeto");
    res.writeHead(200, {"Content-Type": "application/json"});
    let projeto = req.body;
    //console.log(projeto);
    projeto.id = Date.now();
    
    projetos.push(projeto);
    let agenciaalocada = agenciasHomologadas.find(a => a['Nome Agência '].toLowerCase() == projeto.agencia.toLowerCase());
    console.log("Agencia localizada " + agenciaalocada['Nome Agência ']);
    console.log("posicao da agencia " + agenciasHomologadas.indexOf(agenciaalocada)) ;


    if (agenciaalocada.qtProj != undefined) {
        agenciaalocada.qtProj++;
    } else {
        agenciaalocada.qtProj=1;
    }


    let posicaoAtual = agenciasHomologadas.indexOf(agenciaalocada);
    let posicaofinal = agenciasHomologadas.length - 1;

    array_move(agenciasHomologadas, posicaoAtual, posicaofinal );

    agenciaalocada.posicaoFila = posicaofinal;

    
    res.end(JSON.stringify(projeto));

});

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};


app.get("/user/getUserToken/", (requisicao, resposta) => {
    let dados = {
        'Data': new Date(),
        'id' : 'Univille'
    }
    if (segredo == '') {
        resposta.writeHead(401, {"Content-Type": "application/json"});
        resposta.end(JSON.stringify("Você deve se logar para receber um token"));
        
    }
    let token = ''//jwt.sign(dados, segredo);

    let jsonRes = {
           'token': token
    };

    resposta.send(jsonRes);
});

app.get('/styleapp.css', (req, res) => {
    res.sendFile(__dirname + '/views/styleapp.css'); 
});

app.get('/stylecalc.css', (req, res) => {
    res.sendFile(__dirname + '/views/stylecalc.css'); 
});

app.get('/form/styleasteroid.css', (req, res) => {
    res.sendFile(__dirname + '/views/styleasteroid.css'); 
});



app.get('/styleasteroid.css', (req, res) => {
    res.sendFile(__dirname + '/views/styleasteroid.css'); 
});


app.get('/form/form.js', (req, res) => {
    res.sendFile(__dirname + '/views/form.js'); 
});

app.get('/form/projeto.js', (req, res) => {
    res.sendFile(__dirname + '/views/projeto.js'); 
});

app.get('/agencias.js', (req, res) => {
    res.sendFile(__dirname + '/views/agencias.js'); 
});

app.get('/form/asteroid-alert.js', (req, res) => {
    res.sendFile(__dirname + '/views/asteroid-alert.js'); 
});

app.get('/asteroid-alert.js', (req, res) => {
    res.sendFile(__dirname + '/views/asteroid-alert.js'); 
});




app.get('/AgenciasParceiras.json', (req, res) => {
    res.sendFile(__dirname + '/views/AgenciasParceiras.json'); 
});

app.get('/icon_38.png', (req, res) => {
    res.sendFile(__dirname + '/views/icon_38.png'); 
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/views/icon_38.png'); 
});

app.get('/tabulator.min.css', (req, res) => {
    res.sendFile(__dirname + '/views/libs/tabulator.min.css'); 
  });

app.get('/tabulator.min.js', (req, res) => {
    res.sendFile(__dirname + '/views/libs/tabulator.min.js'); 
});
  
  app.get('/luxon.min.js', (req, res) => {
    res.sendFile(__dirname + '/views/libs/luxon.min.js'); 

});

app.listen(5001, () => {
    console.log("Aplicação de API subiu na porta 5001");
});


