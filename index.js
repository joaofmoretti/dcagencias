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


console.log(__dirname);
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

       

        if (nomeAgencia.indexOf(sugestao.agenciapreferencial.toLowerCase().trim()) > -1) {
            console.log("nomeAgencia " + nomeAgencia + " sugestao " + sugestao.agenciapreferencial.toLowerCase().trim() + " " + nomeAgencia.indexOf(sugestao.agenciapreferencial.toLowerCase().trim()) );
            agenciaPreferida = agenciaAvaliada;
            score = score + dados.pontuacao.agenciaPreferencial;
        }

        let casesAG = dados["CASES POR AGÊNCIA "].filter(caso => caso['Agência:'].toLowerCase().indexOf(nomeAgencia) > -1)
        let plataformCaseScore = 0
        let segmentoCaseScore = 0;
        let b2bCaseScore = 0;
        let b2cCaseScore = 0;
        let d2dCaseScore = 0;
        let marketplaceCaseScore = 0;
        let omniCaseScore = 0;

        for (let conta=0; conta < casesAG.length; conta++) {
            let caso = casesAG[conta];
            console.log(caso);
            if (caso["Segmento:"] != undefined) {
                if (caso["Segmento:"].toLowerCase().indexOf(sugestao.segmento) > -1) {
                    segmentoCaseScore = dados.pontuacao.caseSegmento;
                }

                if ((caso['Segmento:'].toLowerCase().indexOf(sugestao.segmento) > -1) && (caso['Plataforma do Case '].toLowerCase().indexOf("shopify") > -1)) {
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

    console.log(sugestao);

});


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
        fs.writeFile('./views/AgenciasParceiras.json', JSON.stringify(dados), { encoding: "utf8"}, (err) => {});
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
    console.log(projeto);
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


