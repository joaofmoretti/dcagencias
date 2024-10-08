let express = require('express');
let bodyParser = require('body-parser');
var fs = require('fs');
const cors = require('cors');

let mapaAgenciaClient = new Map();

let app = express();


let dados = require('./data/AgenciasParceiras.json');

let cases; 

try {
  cases = require("./data/cases.json");
} catch(erroReadingCasesFile) {
  console.log("erroReadingCasesFile");
  console.log(erroReadingCasesFile);
}

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
  
        fs.writeFile('./data/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) })  
    
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
        fs.writeFile('./data/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) }) 
        
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
        fs.writeFile('./data/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) }) 
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
        fs.writeFile('./data/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err)});
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
}

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
    res.sendFile(__dirname + '/data/AgenciasParceiras.json'); 
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

const parsePage = (body, url) => {
    let match = body.match(/<title>([^<]*)<\/title>/)  // regular expression to parse contents of the <title> tag
  
    if (!match || typeof match[1] !== 'string') {
      match = body.match(/<title data-react-helmet="true">([^<]*)<\/title>/)
    }  
  
  
  
    if (!match || typeof match[1] !== 'string') {
      console.debug('Unable to parse the title tag');
      throw new Error('Unable to parse the title tag')
    }
    tituloPagina = match[1];
    console.debug('match[1] ' + match[1])
  
    let cnpj = ''
    try {
      cnpj = body.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)[0];
    } catch (err) {}
    if (cnpj != '') {
      console.debug('cnpjX ' + cnpj);
      
    } else {
      console.debug('cnpjX nao achou');
    }
  
    pagina.url = url
    pagina.title = tituloPagina
    pagina.cnpj = cnpj
  
    return pagina
  }

  let pagina = {
    "url" : "url",
    "title": "title",
    "cnpj" : ""
}

app.post('/dadosGoverno/', encodeUrl,   (req, res) => {

    var busca = req.body.busca;;
    let urlHost = new URL(busca);
    let cnpjEncontrado = ''
    let num = '';
    let result = {}
    console.debug("Pagina !!!!!!!!!!!!!!!!!!!!!!!222222 " + url);
    let pageCNPJ = fetch(url)
            .then(resp => resp.text()) // parse response's body as text
            .then(body => parsePage(body, url)) // extract <title> from body
            .then(pagina => { 
              if (pagina != null && pagina.cnpj != "") {
                cnpjEncontrado = pagina.cnpj;
                num = cnpjEncontrado.replace(/\D/g,'').substring(0,14);
                if (num.length >= 14)  {
                    let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
                    //let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
                  console.debug("urlGover sem passar pelo RegistroBR" + urlGover);
                  fetch(urlGover)
                  // Tratamento do sucesso
                  .then(response => response.json())  // converter para json
                  .then(json => {res.send(json); })    //imprimir dados no console
                  .catch(err => console.debug('Erro de solicitação', err));
                  
                }
            
              }
  
              
  
            }) // send the result back
            .catch(e => { console.debug(e)})
  
  
    pageCNPJ.then((result) => {
  
        console.debug('cnpjEncontrado ' + cnpjEncontrado)
        if (cnpjEncontrado != '') return;
        let registro = fetchRegistroBr(busca);
        registro.then((result) => {
      
          try{
            cnpjEncontrado = [result.entities[0].publicIds[0].identifier];
            num = cnpjEncontrado[0].replace(/\D/g,'').substring(0,14);
          } catch (erro) {
            console.debug("Não foi possível pegar o CNPJ do domímio");
            console.debug(result)
          }  
          if (num.length >= 14)  {
        
            let dados = null;
            let urlGover = 'https://publica.cnpj.ws/cnpj/' + num.toString();
            console.debug("urlGover " + urlGover);
            fetch(urlGover)
            // Tratamento do sucesso
            .then(response => response.json())  // converter para json
            .then(json => {res.send(json);})    //imprimir dados no console
            .catch(err => console.debug('Erro de solicitação', err));
            
          }
        }).catch(erroRegistro => {console.debug("erro na requisicao que recupera o Registro"); console.debug(erroRegistro)});
      }).catch(erroCNPJ => {console.debug("erro na requisicao que recupera o cnpj"); console.debug(erroCNPJ)})    
  })

  async function fetchRegistroBr(inputAddress) {

    let urlHost = new URL(inputAddress);
  
    let result = {}
  
    return new Promise((resolve, reject) => {
      console.debug(registroBR_URL + '/' + urlHost.host);
      fetch(registroBR_URL + '/' +  urlHost.host)
        .then((response) => {
          console.debug(response)
          if (!response.ok) return resolve(result)
          return response.json();
        }).then((jsonData) => {
          console.debug(jsonData)
          result = jsonData
          console.debug(result);		
          let cnpj = [result.entities[0].publicIds[0].identifier];
          let num = cnpj[0].replace(/\D/g,'').substring(0,14);
              resolve(result)
        }).catch((err) => {
              console.debug("erro da parada")  
          console.debug(err)
          reject(err)
          //throw err
          
        });
    })
  }
  

