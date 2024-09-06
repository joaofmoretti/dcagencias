let express = require('express');
let bodyParser = require('body-parser');


var fs = require('fs');
const cors = require('cors');

const registroBR_URL = 'https://rdap.registro.br/domain'

let mapaAgenciaClient = new Map();

let app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

let dados = require('./data/AgenciasParceiras.json');
let cases;
let referencias; 

try {
    referencias = require("./data/referencias.json");
    for (let ca =0; ca <  referencias.length; ca++) {
        let ref = referencias[ca];

        if (ref["Cateogoria Site"] != null) {
            ref.categoria = ref["Cateogoria Site"].toLowerCase();
        } else {
        ref.categoria = '';
        }

     }
  } catch(erroReadingCasesFile) {
    console.log("erroReadingCasesFile");
    console.log(erroReadingCasesFile);
  }

try {
  cases = dados["CASES POR AGÊNCIA  "]
} catch(erroReadingCasesFile) {
  console.log("erroReadingCasesFile");
  console.log(erroReadingCasesFile);
}

let agenciasHomologadas = [];
for (let ca =0; ca <  dados.agencias.length; ca++) { 
    let agen = dados.agencias[ca];
    console.log(agen);
    if (agen["Homologado TOTVS"] != null && agen["Homologado TOTVS"] != undefined) {
        let hom = "";
        hom = agen["Homologado TOTVS"].toLowerCase().trim();
        if (agen["ID Partner"] != null) {
            agen.id = agen["ID Partner"];
        }

        if (agen["Nome responsável"] != null) {
            agen.responsavel = agen["Nome responsável"];
        }

        if (agen["Nome Agência"] != null) {
            agen.agencia = agen["Nome Agência"];
        }

        if (hom == 'homologado') {

            agen.homologada = true;
            agenciasHomologadas.push(agen);
        }
    }
}

let nomeAgencias = [];

for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
    nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência']);
    agenciasHomologadas[ca].posicaoFila = ca+1;
    if (agenciasHomologadas[ca].qtProj == undefined) {
        agenciasHomologadas[ca].qtProj = 0;
    } 

    
    
    agenciasHomologadas[ca].qtCases = contaCases(agenciasHomologadas[ca]['Nome Agência']);
    
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
        for (let ca =0; ca <  dados.agencias.length; ca++) { 
            let agen = dados.agencias[ca];
           
            if (agen["Homologado TOTVS"] != null && agen["Homologado TOTVS"] != undefined) {
                let hom = "";
                hom = agen["Homologado TOTVS"].toLowerCase().trim();
                if (hom == 'homologado') {
                    agenciasHomologadas.push(agen);
                }
            }
        }

       // agenciasHomologadas = dados.agencias.filter(aga => aga["Homologado TOTVS"] != undefined && aga["Homologado TOTVS"].toLowerCase().trim() == 'homologado');
        
        
        nomeAgencias = [];
       
        
        for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
            nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência']);
            let dadoAnterior = null;
            try {
                dadoAnterior = dadosAntigos.agencias.filter((da) => da['Nome Agência'].toLowerCase().trim() == agenciasHomologadas[ca]['Nome Agência'].toLowerCase().trim());
            } catch (err){};
            
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

app.post('/api/v1/agencias/dados/referencias', (req, res) => {
    
    let resultString = "Cases referencia business process";
    let httpCode = 200;
    console.log("Postando dados de REferencias");
    console.log(req.body);
    
    try {
        referencias = []
        referencias = req.body;
        fs.writeFile('./data/referencias.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {console.log(err) }) 
        
    } catch (erro) {
        resultString = "Erro ao atualizar dados das agências " + erro;
        httpCode = 500;
    }

    res.writeHead(httpCode, {"Content-Type": "application/json"});
    res.end(JSON.stringify(resultString));
});

app.get('/api/v1/referencias', (req, res) => { 
    console.log("novo método referencias com categoria ");
    console.log(req.query.cat);
    
let busca = req.query.cat

console.log('busca ' + busca);

   // console.log(referencias);
    
   let filtrados = referencias.filter((pro) => pro.categoria == busca.toLowerCase());
   console.log(filtrados)

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(filtrados));

}) 

app.get('/api/v1/referencias/', (req, res) => { 
    console.log("listagem referencias");
   
   // console.log(referencias);
    
   

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(referencias));

}) 





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


        agenciasHomologadas = dados.agencias.filter(aga => aga["Homologado TOTVS"].toLowerCase().trim() == 'homologado');
        
        
        nomeAgencias = [];
        
        for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
            nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência']);
            let dadoAnterior = dadosAntigos.agencias.filter((da) => da['Nome Agência'].toLowerCase().trim() == agenciasHomologadas[ca]['Nome Agência'].toLowerCase().trim());
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

        dados.agencias[ca].qtCases = contaCases(dados.agencias[ca]['Nome Agência']);
       

    }

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(dados.agencias));
}); 

app.get('/api/v1/agencias/homologadas', (req, res) => {
    
   

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciasHomologadas));
}); 


app.post('/api/v1/sugeriragencia/classificacao', (req, res) => {

    console.log('req.params.site ' + req.body.site);
    let enderecoProspect = new URL(req.body.site);
    
   
    let agenciasdoCliente = mapaAgenciaClient.get(enderecoProspect.host);
    let statusHttp = 200;

    console.log("agencias do cliente");
    console.log(agenciasdoCliente);
    console.log("fim das agencias");
   

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciasdoCliente));

});


app.post('/api/v1/sugeriragencia/classificacao/posicao', (req, res) => {
   console.log("proxima agencia sugerida");
   let enderecoProspect = new URL(req.body.site);
    let agenciasdoCliente = mapaAgenciaClient.get(enderecoProspect.host);
    let posicao = Number.parseInt(req.body.posicao);

    console.log('posicao ' + posicao);
    let statusHttp = 200;

    let agenciaLocalizada = agenciasdoCliente[posicao];

    if (agenciaLocalizada == null) {
        statusHttp = 404;
    }

   

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciaLocalizada));

});

function sugerirAgencia(requisicao, url) {
	
	
   
    console.log("inicio requisicao-----------------------");
    console.log(requisicao);
    console.log("fim requisicao---------------------------------");

    let agenciasSugeridas = [];
    

    console.log("agencias homologadas " + agenciasHomologadas.length);

    let agenciaPreferida;

    for (let iag = 0; iag < agenciasHomologadas.length; iag++) {
        let agenciaAvaliada = agenciasHomologadas[iag];
        
        

        if (!agenciaAvaliada["Homologado TOTVS"].toLowerCase().trim() == 'homologado') continue

        //if (sugestao.shopifyplus && (agenciaAvaliada['Certificação Shopify '].toLowerCase().trim().indexOf('plus') == -1)) continue
        let nomeAgencia = agenciaAvaliada['Nome Agência'] // .toLowerCase().trim();
        
        let score = 0;

        


        if (agenciaAvaliada["Atuante na plataforma Shopify "] != undefined && agenciaAvaliada["Atuante na plataforma Shopify "].toLowerCase().trim() == 'sim') {

            
            score = score + dados.pontuacao.Atuanteshopify
        }

       
        
    

        if (agenciaAvaliada['Certificação Shopify'] != null && agenciaAvaliada['Certificação Shopify'].toLowerCase().trim().indexOf('foundation')) {
            score = score + dados.pontuacao.certShopify;
        }

        if (agenciaAvaliada['Certificação Shopify'] != null && agenciaAvaliada['Certificação Shopify'].toLowerCase().trim().indexOf('plus')) {
            score = score + dados.pontuacao.certShopifyPlus;

            
        }

       
       

        let casesAG = retornaCases(nomeAgencia);
        let plataformCaseScore = 0
        let segmentoCaseScore = 0;
        let b2bCaseScore = 0;
        let b2cCaseScore = 0;
        let d2dCaseScore = 0;
        let marketplaceCaseScore = 0;
        let omniCaseScore = 0;
        let cnaeFiscalScore = 0
        
        agenciaAvaliada.qtCases = contaCases(nomeAgencia);


    
        
        for (let conta=0; conta < casesAG.length; conta++) {
            let caso = casesAG[conta];
            //console.log(caso);
            if (caso["Segmento:"] != undefined) {
                //if (caso["Segmento:"].toLowerCase().trim().indexOf(requisicao.segmento.toLowerCase().trim()) > -1) {
                    //segmentoCaseScore = dados.pontuacao.caseSegmento;
                //}

                //if ((caso["Segmento:"].toLowerCase().trim().indexOf(requisicao.segmento.toLowerCase().trim()) > -1) ) {
                    //plataformCaseScore = dados.pontuacao.caseSegmentoPlatafoma;
               // }
            }

            if (caso.CnaeFiscal != null && caso.CnaeFiscal == requisicao.estabelecimento.atividade_principal.id) {
                cnaeFiscalScore = dados.pontuacao.cnaeFiscal;
            }

            
            

        }
        score = score + plataformCaseScore + cnaeFiscalScore + segmentoCaseScore + b2bCaseScore + b2cCaseScore + d2dCaseScore +marketplaceCaseScore + omniCaseScore;


        agenciaAvaliada.score = score - iag;
       // agenciaAvaliada.cliente = sugestao.nome;
        agenciasSugeridas.push(agenciaAvaliada);
    }

    agenciasSugeridas.sort((a, b) => (a.score < b.score ? 1 : -1));

    if (agenciaPreferida != null) {
        console.log("melhor: " + agenciasSugeridas[0]['Nome Agência'] + ' ' + agenciasSugeridas[0].score + " favorita: " + agenciaPreferida['Nome Agência'] + ' ' + agenciaPreferida.score);
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
    
    console.log("url " + url);
    let enderecoProspect = new URL(url);
    mapaAgenciaClient.set(enderecoProspect.host, agenciasSugeridas);
    console.log("enderecoProspect.host " + enderecoProspect.host);
   

   console.log("primeira agencia sugerida como resposta");
    
   
    console.log(agenciasSugeridas[0]['Nome Agência'] + ' score ' + agenciasSugeridas[0].score);
    return agenciasSugeridas[0];

    

}

function retornaReferencias(nomedaAgencia) {
    
    let casesshopify = cases.filter(caso => caso['Solução'] == "SHOPIFY" && caso['Agências'] == nomedaAgencia);

	//let casosdaAgencia = casesshopify.filter(cs => cs.Agências.toLowerCase().trim().indexOf(nomeAgencia) > -1);

    console.log("A agncia " + nomedaAgencia + " tem " + casesshopify.length + " cases ");

    return casesshopify;
}


function retornaCases(nomedaAgencia) {
    
    console.log("nomedaAgencia " + nomedaAgencia);

    let casesshopify = dados["CASES POR AGÊNCIA "].filter(caso => caso['Agência:'].toLowerCase().trim().indexOf(nomedaAgencia.trim().toLowerCase()) > -1)

	//let casosdaAgencia = casesshopify.filter(cs => cs.Agências.toLowerCase().trim().indexOf(nomeAgencia) > -1);

    console.log("A agência " + nomedaAgencia + " tem " + casesshopify.length + " cases ");

    return casesshopify;
}

function contaCases(nomedaAgencia) {
  

	let casosdaAgencia = retornaCases(nomedaAgencia);

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
    let agenciaalocada = agenciasHomologadas.find(a => a['Nome Agência'].toLowerCase() == projeto.agencia.toLowerCase());
    console.log("Agencia localizada " + agenciaalocada['Nome Agência']);
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

app.get('/referncias.json', (req, res) => {
    res.sendFile(__dirname + '/data/referencias.json'); 
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

app.listen(10000, () => {
    console.log("Aplicação de API subiu na porta 10000");
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

app.post('/api/v1/sugeriragencia/', encodeUrl,   (req, res) => {

    var busca = req.body.site;;
    let url = new URL(busca);
    let cnpjEncontrado = ''
    let num = '';
    let result = {}
    console.debug("DadosGoverno - pegando dados para: " + url);
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
                  .then(json => {res.send(sugerirAgencia(json, url)); })    //imprimir dados no console
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
            .then(json => {res.send(sugerirAgencia(json, url));})    //imprimir dados no console
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
          //console.debug(jsonData)
          result = jsonData
          //console.debug(result);		
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
  
  app.get('/ping', (req, res) => {
    console.log(req);
    res.status(201).send(req.hostname);
  })



  app.post('/api/v1/agencias/agendamentos', encodeUrl,   (req, res) => {

    var busca = req.body.agencia;

    let vendedores = [];

    if (busca == 1507732) {
        vendedores = [377152, 377151];
    } else if (busca == 1567749) {
        vendedores = [377150];
    } else if (busca == 2942271) {
        vendedores =[ 377154, 377165 ];
    } else if (busca == 3333333) {
        vendedores = [
            377161,
            377162
          ];
    } else if (busca == 22222) {
        vendedores = [
            377155,
            377156
          ];
    }  else if (busca == 571401) {
        vendedores = [
            377158,
            377157
          ];
    }   

    console.log(busca);
    
    const myHeaders = new Headers();
myHeaders.append("authorization", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIgfQ.eyJJZCI6Mzk1NzcxLCJOb21lIjoiSm_Do28iLCJTb2JyZW5vbWUiOiJNb3JldHRpIiwiVGVsMSI6IiIsIlJvbGUiOjIsIkVtYWlsIjoiam9hby5tb3JldHRpQHRvdHZzLmNvbS5iciIsIklkaW9tYSI6InB0LUJSIiwiQ05QSiI6Ijc5Mzg4ODQzMDAwMTY3IiwiRW1wcmVzYSI6eyJJZCI6MTUwNDEsIkZ1bmlsUGFkcmFvSWQiOjg3ODQsIkZ1c29Ib3JhcmlvIjoiRS4gU291dGggQW1lcmljYSBTdGFuZGFyZCBUaW1lIiwiTGltaXRlQnVzY2FEYWRvcyI6NTAsIkNvbnN1bW9CdXNjYURhZG9zIjowLCJUZWxlZm9uaWFJbnRlZ3JhZGEiOnRydWUsIkZsQmxvcXVlaW8iOmZhbHNlLCJUaXBvIjoyLCJUaXBvUGxhbm8iOjF9LCJDb25qdW50b0FjZXNzb0lkIjoxMzc5NywiR3J1cG9zIjpbXSwiRW52aWFyRW1haWxGZWVkYmFja1ZlbmRlZG9yIjp0cnVlLCJNb3ZlckxlYWRMaXZyZW1lbnRlRW50cmVGdW5pcyI6dHJ1ZSwiUHJvdGVjYW9EYWRvcyI6ZmFsc2UsIlJlZW52aWFyQ1JNIjpmYWxzZSwiSVAiOiIiLCJXaGF0c0FwcCI6eyJBdGl2byI6ZmFsc2UsIkNhbmNlbGFkbyI6ZmFsc2V9LCJQb3NzdWlJbnRlZ3JhY2FvRmluYW5jZWlyYSI6dHJ1ZSwiV2VicGhvbmVBdGl2byI6dHJ1ZSwiQ2xhaW1zIjpbeyJGdW5jaW9uYWxpZGFkZSI6MSwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjIsIk5pdmVsQWNlc3NvIjowLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjozLCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NCwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjUsIk5pdmVsQWNlc3NvIjowLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo2LCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NywiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjgsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo5LCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MTAsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoxMSwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjEyLCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MTMsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoxNCwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjE1LCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MTYsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoxNywiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjE4LCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MTksIk5pdmVsQWNlc3NvIjowLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoyMCwiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjIxLCJOaXZlbEFjZXNzbyI6MCwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MjIsIk5pdmVsQWNlc3NvIjozLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoyMywiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjI0LCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MjUsIk5pdmVsQWNlc3NvIjozLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoyNiwiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjI3LCJOaXZlbEFjZXNzbyI6MCwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MjgsIk5pdmVsQWNlc3NvIjozLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjoyOSwiTml2ZWxBY2Vzc28iOjAsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjMwLCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MzEsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjozMiwiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjMzLCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MzQsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjozNSwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjM2LCJOaXZlbEFjZXNzbyI6MCwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6MzcsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjozOCwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjM5LCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NDAsIk5pdmVsQWNlc3NvIjozLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo0MSwiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjQyLCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NDMsIk5pdmVsQWNlc3NvIjowLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo0NCwiTml2ZWxBY2Vzc28iOjAsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjQ1LCJOaXZlbEFjZXNzbyI6MCwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NDYsIk5pdmVsQWNlc3NvIjowLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo0NywiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjQ4LCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NDksIk5pdmVsQWNlc3NvIjozLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo1MCwiTml2ZWxBY2Vzc28iOjAsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjUxLCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NTIsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo1MywiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjU0LCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NTUsIk5pdmVsQWNlc3NvIjowLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo1NiwiTml2ZWxBY2Vzc28iOjEsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjU5LCJOaXZlbEFjZXNzbyI6MywiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NjAsIk5pdmVsQWNlc3NvIjozLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo2MSwiTml2ZWxBY2Vzc28iOjMsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjYyLCJOaXZlbEFjZXNzbyI6MSwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH0seyJGdW5jaW9uYWxpZGFkZSI6NjMsIk5pdmVsQWNlc3NvIjoxLCJHcnVwb3MiOltdLCJDb25qdW50b0FjZXNzb0lkIjowfSx7IkZ1bmNpb25hbGlkYWRlIjo2NCwiTml2ZWxBY2Vzc28iOjAsIkdydXBvcyI6W10sIkNvbmp1bnRvQWNlc3NvSWQiOjB9LHsiRnVuY2lvbmFsaWRhZGUiOjY1LCJOaXZlbEFjZXNzbyI6MCwiR3J1cG9zIjpbXSwiQ29uanVudG9BY2Vzc29JZCI6MH1dLCJGZWF0dXJlVG9nZ2xlcyI6eyJOdW1UZW50YXRpdmFzRXhjZWNhb0FQSSI6MCwiUmVnZXhFeGNlY2FvVVJMIjoiL1xcLyhwZXNxdWlzYXJ8bGlzdGFyfGJ1c2NhcikkLyIsIkRldGFsaGFyRGFzaGJvYXJkIjpmYWxzZSwiVGVtcG9NZWRpb0Rhc2hib2FyZCI6ZmFsc2UsIkF0aXZpZGFkZXNOYXZiYXIiOmZhbHNlLCJFbXByZXNhQWdlbmRhbWVudG9Qb3JQViI6ZmFsc2UsIkVuY2VycmFyV0ZDb25jbHVzYW9BdGl2aWRhZGUiOmZhbHNlLCJBZGljaW9uYXJQcm9kdXRvc1ZlbmRpZG9zIjpmYWxzZSwiUm9sbG91dFByZXZpc2FvRmVjaGFtZW50byI6dHJ1ZSwiSGFiaWxpdGFyU2VsZWN0U2ltcGxlc0NhcmdvIjpmYWxzZSwiVmlkZW9jb25mZXJlbmNpYSI6ZmFsc2UsIlJvbGxvdXRSZWN1cGVyYXJNdWx0aXBsb3NGdW5pcyI6dHJ1ZSwiUm9sbG91dEFnZW5kYUludGVsaWdlbnRlIjpmYWxzZSwiTWVudUV4YWN0Q2x1YiI6ZmFsc2UsIlJvbGxvdXRNZW51Q29uZmlndXJhdmVsIjpmYWxzZSwiUm9sbG91dFNlZ21lbnRhY2FvIjp0cnVlLCJSb2xsb3V0VHJhbnNjcmljYW9MaWdhY2FvIjp0cnVlLCJSb2xsb3V0VGltZWxpbmUiOmZhbHNlLCJNZW51Q29uZmlndXJhdmVsIjpmYWxzZSwiUm9sbG91dEludGVncmFjYW9BZ2VuZGFtZW50b0FzeW5jIjpmYWxzZSwiUm9sbG91dFNhbHZhckZpbHRyb0NhY2hlIjp0cnVlLCJUcmFuc2ZlcmlyVmVuZGVkb3JMb3RlIjpmYWxzZSwiRHVwbGljYXJMZWFkRW1RdWFscXVlckV0YXBhIjp0cnVlLCJNZW51V2hhdHNBcHAiOmZhbHNlLCJSb2xsb3V0RGFzaGJvYXJkUGVyaW9kb1BhZHJhbyI6dHJ1ZSwiUm9sbG91dFZpZGVvY29uZmVyZW5jaWFNZW50b3JJQSI6ZmFsc2V9LCJSZWFkT25seSI6ZmFsc2UsIk1lbnVDb25maWd1cmF2ZWwiOnsiTGFiZWwiOiJWaWRlb2NvbmZlcsOqbmNpYSIsIkljb25lIjoidmlkZW9fY2FtZXJhX2Zyb250IiwiSWZyYW1lIjoiaHR0cHM6Ly9zcG90dGVyLXZpZGVvY29uZmVyZW5jaWEuc29mdHIuYXBwLyJ9LCJFbXByZXNhQ2xpZW50ZUlkIjoxNTA0MSwiVGltZXpvbmUiOiJFLiBTb3V0aCBBbWVyaWNhIFN0YW5kYXJkIFRpbWUiLCJPbmJvYXJkaW5nVGFncyI6IiN3ZWJwaG9uZTIwMTJkZyMgI24zMTAwMSMgI2dvc2F0ZGcyIyAjZ29zYXRkZzMjICNwaG9uZWZvcmFkZyMgI2RnMjUwNCMgI2RnMjUwNG9rIyAjZGcyNW9rIyIsIldlYkFuYWx5dGljc1Rvb2xIYWJpbGl0YWRvIjp0cnVlLCJFc3RhTm9BbWJpZW50ZURlRGVzZW52b2x2aW1lbnRvIjpmYWxzZSwiRXN0YU5vQnJhbmNoRGVSQyI6dHJ1ZSwiVXN1YXJpb0NyZWF0ZWRBdCI6IjIwMjQtMDctMDNUMTg6MTk6MzUuOTQxODgyNSIsIk1vc3RyYXJQZXNxdWlzYSI6ZmFsc2UsIkNvbGV0YXJOUFMiOmZhbHNlLCJVc3VhcmlvSW50ZXJubyI6ZmFsc2UsIlVybHNNb25pdG9yYWRhcyI6Ii9zcG90dGVyL2JhbmNvLXRhbGVudG9zLC9zcG90dGVyL2Jhc2UtbGVhZHMvZnVuaWwsL1Byb2pldG9QaXBlbGluZS9TZWFyY2hpbmc_Y2xhaW09TU9EVUxPU0VBUkNISU5HLC9Qcm9qZXRvUGlwZWxpbmUvTGVhZC9JbXBvcnRhciwvc3BvdHRlci9jb25maWd1cmFjb2VzL2ludGVncmFjb2VzLC9zcG90dGVyL3dvcmtmbG93LC9zcG90dGVyL2Rhc2hib2FyZCwvc3BvdHRlci9kYXNoYm9hcmQtcHJldmVuZGVkb3IsL0dlcmVuY2lhL0Rhc2hib2FyZCwvQ29uZmlndXJhY2FvL0F1dG9tYWNhbywvc3BvdHRlci9jYWRlbmNpYS1lbWFpbHMvY2FtcGFuaGFzLC9zcG90dGVyL2F0aXZpZGFkZXMsL1Jlc3VsdHlzLC9HZXJlbmNpYS9UcmFuc2ZlcmVuY2lhLC9HZXJlbmNpYS9JbXBvcnRhY2FvLC9Db25maWd1cmFjYW8vUGFpbmVsQ29uZmlndXJhY29lcywvUmVncmFzRGV0ZWNjYW8vUmVncmFEZXRlY2Nhby9JbmRleCwvUmVncmFzRGV0ZWNjYW8vUHJvZHV0b3MvSW5kZXgsL0NvbmZpZ3VyYWNhby9Db25maWd1cmFjYW9JbnRlZ3JhY29lcy9JbmRleCwvc3BvdHRlci9jZW50cmFsLWVtYWlscy9lbnRyYWRhLC9CQS9SZWxhdG9yaW8iLCJCcmFuY2giOjMsImV4cCI6MTc1MzI2MTMxN30.u8pJJjqyZ9ZWnjAd4zOUohwYQs9B6it9BnV0QG485U8");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "dataInicial": "2024-07-28T03:00:00.000Z",
  "dataFinal": "2024-09-08T03:00:00.000Z",
  "UsuarioVendedorId": vendedores
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://backend.exactspotter.com/api/pipeline/calendario/buscarEventos", requestOptions)
  .then((response) => response.json())
  .then((result) => {console.log(result);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(result));
  })
  .catch((error) => console.error(error));


  });   


