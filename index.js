let express = require('express');
let bodyParser = require('body-parser');

let mapaAgenciaClient = new Map();

let app = express();

let campoToken = "Token";
let segredo = '';

let dados = require('./views/AgenciasParceiras.json');

let agenciasHomologadas = dados.agencias.filter(aga => aga["Homologado TOTVS "].toLowerCase().trim() == 'homologado');

let nomeAgencias = [];

for (let ca =0; ca <  agenciasHomologadas.length; ca++) {
    nomeAgencias.push(agenciasHomologadas[ca]['Nome Agência ']);
}

const { application } = require('express');
const { json } = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/views/form.html'));
app.use(express.static(__dirname + '/views/agenciasfila.html'));
app.use(express.static(__dirname + '/views/cadastroagencia.html'));
app.use(express.static(__dirname + '/views/cadastroprojetos.html'));
app.use(express.static(__dirname + '/views/styleforms.css'));
app.use(express.static(__dirname + '/views/form.js'));
console.log(__dirname);
app.use(express.static(__dirname + '/views/login.html'));
app.use(express.static(__dirname + '/views/stylelogin.css'));

let router = express.Router();
app.use("/form/",router);
app.use("/login/",router);
app.use("/projeto/",router);
app.use(("/agenciasfila/", router))
app.use(("/cadastroagencia/", router))
app.use(("/cadastroprojetos/", router))
let encodeUrl = bodyParser.urlencoded({ extended: false });

let projetos = []

app.get('/', (req, res) => {
    
    res.redirect('/projeto/');
    //res.sendFile(__dirname + '/views/form.html');
});  

app.get('/form/', (req, res) => {
    
    res.sendFile(__dirname + '/views/form.html');
});

app.get('/agenciasfila/', (req, res) => {
    
    res.sendFile(__dirname + '/views/agenciasfila.html');
});

app.get('/cadastroagencias/', (req, res) => {
    
    res.sendFile(__dirname + '/views/cadastroagencias.html');
});

app.get('/cadastroprojetos/', (req, res) => {
    
    res.sendFile(__dirname + '/views/cadastroprojetos.html');
});

app.get('/projeto/', (req, res) => {
    
    res.sendFile(__dirname + '/views/projeto.html');
});

app.get('/prospeccao/', (req, res) => {
    
    res.writeHead(301, {
        Location: `http://179.223.166.224:3000/`
      }).end();
});





function validaToken(requisicao) {
    return;
    let tokenText = requisicao.header(campoToken);
    
    let tokenVerificado = jwt.verify(tokenText, segredo);
    
    if (!tokenVerificado) {
        console.log("erro no token ");
        throw("Erro de verificação do token");
    } else {
        console.log("Token verificado com sucesso!")
    }
}

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
    
    console.log("get no metodo de listagem de nomes de agencias");

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(nomeAgencias));
}); 

app.get('/api/v1/projetos/', (req, res) => {
    
    console.log("get no metodo de listagem de nomes de projetos");

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(projetos));
}); 

app.get('/api/v1/agencias/', (req, res) => {
    
    console.log("get no metodo de listagem de agencias");

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agencias.agencias));
}); 

app.get('/api/v1/agencias/homologadas', (req, res) => {
    
    console.log("get no metodo de listagem de agencias");

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
            score =  3000 - (iag * 200);
        } 


        if (agenciaAvaliada["Atuante na plataforma Shopify "] != undefined && agenciaAvaliada["Atuante na plataforma Shopify "].toLowerCase().trim() == 'sim') {

            
            score = score + 100
        }

       
        
    

        if (agenciaAvaliada['Certificação Shopify '].toLowerCase().trim().indexOf('foundation')) {
            score = score + 100;
        }

        if (agenciaAvaliada['Certificação Shopify '].toLowerCase().trim().indexOf('plus')) {
            score = score + 200;

            if (sugestao.shopifyplus) {
                score = score + 500;
            }
        }

       

        if (nomeAgencia.indexOf(sugestao.agenciapreferencial.toLowerCase().trim()) > -1) {
            console.log("nomeAgencia " + nomeAgencia + " sugestao " + sugestao.agenciapreferencial.toLowerCase().trim() + " " + nomeAgencia.indexOf(sugestao.agenciapreferencial.toLowerCase().trim()) );
            agenciaPreferida = agenciaAvaliada;
            score = score + 500;
        }

        let casesAG = agencias["CASES POR AGÊNCIA "].filter(caso => caso.AGÊNCIA.toLowerCase().indexOf(nomeAgencia) > -1)
        let plataformCaseScore = 0
        let segmentoCaseScore = 0;
        let b2bCaseScore = 0;
        let b2cCaseScore = 0;
        let d2dCaseScore = 0;
        let marketplaceCaseScore = 0;
        let omniCaseScore = 0;

        for (let conta=0; conta < casesAG.length; conta++) {
            let caso = casesAG[conta];

            if (caso['SEGMENTO '].toLowerCase().indexOf(sugestao.segmento) > -1) {
                segmentoCaseScore = 500;
            }

            if ((caso['SEGMENTO '].toLowerCase().indexOf(sugestao.segmento) > -1) && (caso['PLATAFORMA '].toLowerCase().indexOf("shopify") > -1)) {
                plataformCaseScore = 1000;
            }

            

            if (caso['Especialidade B2B B2C'] != undefined) {
                let mercados = caso['Especialidade B2B B2C'].toLowerCase();
                if (sugestao.b2b && (mercados.indexOf('b2b') > -1)) {
                    b2bCaseScore =  1500;
                }

                if (sugestao.b2c && (mercados.indexOf('b2c') > -1)) {
                    b2cCaseScore = 1500;
                }

              

                if (sugestao.d2c && (mercados.indexOf('d2c') > -1)) {
                    d2dCaseScore =  1500;
                }

                if (sugestao.marketplace && (mercados.indexOf('marketplace') > -1)) {
                   marketplaceCaseScore =  1500;
                }

                if (sugestao.Omni && (mercados.indexOf('omni') > -1)) {
                    omniCaseScore = 1500;
                }

            }




        }
        score = score + plataformCaseScore + segmentoCaseScore + b2bCaseScore + b2cCaseScore + d2dCaseScore +marketplaceCaseScore + omniCaseScore;


        agenciaAvaliada.score = score;
       // agenciaAvaliada.cliente = sugestao.nome;
        agenciasSugeridas.push(agenciaAvaliada);
    }

    agenciasSugeridas.sort((a, b) => (a.score < b.score ? 1 : -1));

    if (agenciaPreferida != null) {
        console.log("melhor: " + agenciasSugeridas[0]['Nome Agência '] + ' ' + agenciasSugeridas[0].score + " favorita: " + agenciaPreferida['Nome Agência '] + ' ' + agenciaPreferida.score);
        if (agenciasSugeridas[0].score > agenciaPreferida.score) {
            let porcentagem = 100 - ((agenciaPreferida.score * 100) / agenciasSugeridas[0].score);
            console.log("porcentagem " + porcentagem);
            if (porcentagem < 30) {

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

app.get('/api/v1/projetos/', (req, res) => {
    let statusHttp = 200;
    
    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(projetos));

});


app.post('/api/v1/projeto/', encodeUrl, (req, res) => {
	
	console.log("salvando o projeto");
    res.writeHead(200, {"Content-Type": "application/json"});
    let projeto = req.body;
    console.log(projeto);
    
    projetos.push(projeto);
    let agenciaalocada = agenciasHomologadas.find(a => a['Nome Agência '].toLowerCase() == projeto.agencia.toLowerCase());
    console.log("Agencia localizada " + agenciaalocada['Nome Agência ']);
    console.log("posicao da agencia " + agenciasHomologadas.indexOf(agenciaalocada)) ;

    let posicaoAtual = agenciasHomologadas.indexOf(agenciaalocada);
    let posicaofinal = agenciasHomologadas.length - 1;

    array_move(agenciasHomologadas, posicaoAtual, posicaofinal );


    
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

app.get('/form/styleforms.css', (req, res) => {
    res.sendFile(__dirname + '/views/styleforms.css'); 
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

app.listen(5001, () => {
    console.log("Aplicação de API subiu na porta 5001");
});


