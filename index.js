let express = require('express');
let bodyParser = require('body-parser');

let mapaAgenciaClient = new Map();

let app = express();

let campoToken = "Token";
let segredo = '';

let agencias = {
    "agencias":[
     {
      "Nome Agência ": "CheckStore Full E-commerce",
      "Site Agência ": "https:\/\/checkstore.com.br",
      "Nome responsável ": "Érico Scorpioni",
      "E-mail do resposável ": "erico@checkstore.com.br",
      "Cel do responsável ": 48991616059,
      "Cidade ": "Florianópolis",
      "Estado ": "SC",
      "Quant. Colaboradores": 35,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "10 projetos simultâneos",
      "Quant. projetos Shopify ": "+100",
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "Chamado reaberto em 13\/09 - GFC-537    Reprovado  - á tivemos o retorno e o candidato foi reprovado na avaliação financeira.\nUm dos sócios possui apontamento em seu CPF, impossibilitando a homologação",
      "Parceria com Franquia ": "TOTVS CORPORATIVO ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "https:\/\/www.labellamafia.com.br\/",
      "Quant. projetos implantados VTEX ": 4,
      "Principais projetos implantados SHOPIFY ": "Arezzo, Schutz, Alexandre Birman, Simple Organic, Coffee++, Camila Klein, Volcom, Care Natural Beauty, Homedock",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": 60,
      "Tempo médio de implantação VTEX ": 120
     },
     {
      "Nome Agência ": "Maeztra",
      "Site Agência ": "maeztra.com",
      "Nome responsável ": "Diego Rocha",
      "E-mail do resposável ": "diego@maeztra.com",
      "Cel do responsável ": 11995299696,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 140,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "80 projetos simultâneo",
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER, QUADRANTE",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "SIM  ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "https:\/\/www.jequiti.com.br\/, https:\/\/www.portobrasilceramica.com.br\/, https:\/\/www.panamericana.com.co\/, https:\/\/www.umusicstore.com\/, https:\/\/www.ironstudios.com.br\/, https:\/\/www.tvz.com.br\/, https:\/\/www.libresse.com.br\/, https:\/\/www.bagaggio.com.br\/, https:\/\/www.manole.com.br\/, https:\/\/www.emporiovivendadocamarao.com.br\/",
      "Quant. projetos implantados VTEX ": "mais de 400 projetos",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação VTEX ": "100 dias"
     },
     {
      "Nome Agência ": "Vinci",
      "Site Agência ": "www.agenciavinci.com.br",
      "Nome responsável ": "Caio Mattos Marcolino",
      "E-mail do resposável ": "caio@agenciavinci.com.br",
      "Cel do responsável ": 24992919121,
      "Cidade ": "Petrópolis",
      "Estado ": "RJ",
      "Quant. Colaboradores": 21,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "Variável de acordo com a complexidade de projetos",
      "Quant. projetos Shopify ": 2,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "EM ANDAMENTO ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "Garmin, Victorinox, Frescatto, Carone",
      "Quant. projetos implantados VTEX ": "Mais de 100",
      "Principais projetos implantados SHOPIFY ": "Design Up Living, Gringa",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": "Varia de acordo com a complexidade",
      "Tempo médio de implantação VTEX ": 90
     },
     {
      "Nome Agência ": "Disco",
      "Site Agência ": "www.disco-tec.com",
      "Nome responsável ": "Bruno Berezaga",
      "E-mail do resposável ": "bruno@disco-tec.com",
      "Cel do responsável ": 11961770747,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 16,
      "Tempo de mercado ": "ATÉ 2 ANOS",
      "Capacidade simultanea de implatação de projeto ": "escalável",
      "Quant. projetos Shopify ": "+20",
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "17\/08 abertura do chamado GFC-324  \/ Documentação solicitada 28\/07\/ 08\/08  ",
      "Parceria com Franquia ": "TOTVS LESTE ",
      "Atuante na plataforma VTEX ": "NÃO",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados SHOPIFY ": "www.oriba.com.br\nwww.comprecimed.com.br\nwww.gummyhair.com.br",
      "Possui arquiteto ": "NÃO ",
      "Tempo médio de implantação Shopify ": 75
     },
     {
      "Nome Agência ": "E-Plus ",
      "Site Agência ": "www.agenciaeplus.com.br",
      "Nome responsável ": "Tiago Moraes ",
      "E-mail do resposável ": "tiago@agenciaeplus.com.br",
      "Cel do responsável ": 11945473945,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 73,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 40,
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER, QUADRANTE",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "Assinado em 26\/09",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "Pirelli (Campneus), Probel Colchões, Lojas Torra, Brooksfield, Gregory, Pierre Cardin, CRS Brands.",
      "Quant. projetos implantados VTEX ": "Mais de 300",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação VTEX ": "90 dias"
     },
     {
      "Nome Agência ": "Eazy Go",
      "Site Agência ": "https:\/\/eazygo.com.br\/",
      "Nome responsável ": "Verônica Santos",
      "E-mail do resposável ": "veronica@eazygo.com.br",
      "Cel do responsável ": 11967995097,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 12,
      "Tempo de mercado ": "ATÉ 2 ANOS",
      "Capacidade simultanea de implatação de projeto ": "100 projetos\/mês ",
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER, QUADRANTE",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Sem interesse ",
      "OBS\/Motivo ": "29\/09 a Documentação enviada foi da Maeztra.. aguardando o envio da dacumentação correta 19\/09 - GFC-617  Documentação solicitada 28\/07\/ 08\/08 ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "https:\/\/www.maxior.com.br\/; www.liway.com.br; https:\/\/www.kayland.com.br\/",
      "Quant. projetos implantados VTEX ": 8,
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação VTEX ": "30 dias para Go live e 10 dias para implantar o front end"
     },
     {
      "Nome Agência ": "Benova",
      "Site Agência ": "https:\/\/benova.ag\/",
      "Nome responsável ": "Renan Santos",
      "E-mail do resposável ": "renan@benova.ag",
      "Cel do responsável ": 41998851558,
      "Cidade ": "Curitiba",
      "Estado ": "PR",
      "Quant. Colaboradores": 47,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "Média 30",
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER, QUADRANTE",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "EM ANDAMENTO ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "https:\/\/uau.bobinex.com.br\/\nhttps:\/\/www.crocs.com.br\/\nhttps:\/\/loja.karcher.com.br\/",
      "Quant. projetos implantados VTEX ": "+50",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação VTEX ": 180
     },
     {
      "Nome Agência ": "CRP Mango",
      "Site Agência ": "www.crpmango.com.br",
      "Nome responsável ": "Diego Puerta",
      "E-mail do resposável ": "diego@crpmango.com.br",
      "Cel do responsável ": 11984529722,
      "Cidade ": "Itatiba",
      "Estado ": "SP",
      "Quant. Colaboradores": 25,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "Temos uma média de 10 projetos em andamento ao mesmo tempo, mas o processo nos permite ajustar o time para atender uma possível alta na demanda.",
      "Quant. projetos Shopify ": "De 10 a 15",
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "SIM  10\/08",
      "Parceria com Franquia ": "TOTVS IP ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "Loja Segredos de Salão (L'Oréal Brasil), e.Dona, SkinCeuticals",
      "Quant. projetos implantados VTEX ": "Mais de 50 projetos, quase 10 anos de parceria",
      "Principais projetos implantados SHOPIFY ": "https:\/\/harpercollins.com.br\/, https:\/\/www.apsecosmetics.com.br\/, https:\/\/www.cadernointeligente.com.br\/",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": "60 dias",
      "Tempo médio de implantação VTEX ": 90
     },
     {
      "Nome Agência ": "Codeby",
      "Site Agência ": "https:\/\/codeby.global\/",
      "Nome responsável ": "Fellipe Guimarães",
      "E-mail do resposável ": "fellipe.guimaraes@keyrus.com.br",
      "Cel do responsável ": 11981959075,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 2000,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 15,
      "Quant. projetos Shopify ": 25,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER, QUADRANTE",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Aguardando documentação ",
      "OBS\/Motivo ": "Só está pendente o documento participação societária ",
      "Parceria com Franquia ": "TOTVS LE",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "https:\/\/mercado.carrefour.com.br\/\nhttps:\/\/shoppingleblon.com.br\/\nhttps:\/\/www.santalolla.com.br\/\nhttps:\/\/it.canali.com\/",
      "Quant. projetos implantados VTEX ": 250,
      "Principais projetos implantados SHOPIFY ": "https:\/\/waaw.com.br\/\nhttps:\/\/fr.dengo.com\/\nhttps:\/\/www.squeem.com\/",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": 60,
      "Tempo médio de implantação VTEX ": 60
     },
     {
      "Nome Agência ": "TDZAIN",
      "Site Agência ": "tdzain.com",
      "Nome responsável ": "Thiago Paiva",
      "E-mail do resposável ": "thiago@tdzain.com.br",
      "Cel do responsável ": 41984580008,
      "Cidade ": "Pinhais",
      "Estado ": "PR",
      "Quant. Colaboradores": 12,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 6,
      "Quant. projetos Shopify ": 2,
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Reprovado",
      "OBS\/Motivo ": "Reprovado  - Identificamos que este candidato possui empresa unipessoal e não homologamos empresas de um único sócio.",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "cassol.com.br\nnichele.com.br\nbigben.com.br",
      "Quant. projetos implantados VTEX ": "+ de 100",
      "Principais projetos implantados SHOPIFY ": "annabbags.com",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": 90,
      "Tempo médio de implantação VTEX ": 45
     },
     {
      "Nome Agência ": "Simples.Inovação",
      "Site Agência ": "simplesinovacao.com",
      "Nome responsável ": "Elias Ferreira da Silva",
      "E-mail do resposável ": "eferreira@simplesinovacao.com",
      "Cel do responsável ": 21974677233,
      "Cidade ": "Niterói ",
      "Estado ": "RJ",
      "Quant. Colaboradores": "+40",
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "Até 10 projetos em simultâneo ",
      "Quant. projetos Shopify ": "+20",
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Aguardando documentação ",
      "OBS\/Motivo ": "Documentação solicitada 28\/07\/ 08\/08 ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "Flamengo, Boticário e Blueman",
      "Quant. projetos implantados VTEX ": "+30",
      "Principais projetos implantados SHOPIFY ": "Fiber, Everlast e Ekazza",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": "45 dias",
      "Tempo médio de implantação VTEX ": "80 dias"
     },
     {
      "Nome Agência ": "Resultate ",
      "Site Agência ": "https:\/\/www.resultate.com.br\/",
      "Nome responsável ": "Tomir Schmite",
      "E-mail do resposável ": "tomir.junior@resultate.com.br",
      "Cel do responsável ": 27981426766,
      "Cidade ": "Vitoria",
      "Estado ": "ES",
      "Quant. Colaboradores": 60,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 10,
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Sem interesse ",
      "OBS\/Motivo ": "Documentação solicitada 28\/07\/ 08\/08 ",
      "Parceria com Franquia ": "TOTVS LESTE",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO",
      "Principais projetos implantados VTEX ": "Loja ADCOS, Itapuã Calçados, Colibri Festas e Supercampo",
      "Quant. projetos implantados VTEX ": 30,
      "Principais projetos implantados SHOPIFY ": 0,
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": 15,
      "Tempo médio de implantação VTEX ": 20
     },
     {
      "Nome Agência ": "2B Digital",
      "Site Agência ": "agencia2bdigital.com.br",
      "Nome responsável ": "ALEXANDRE",
      "E-mail do resposável ": "ALEXANDRE.HUTEAU@TOTVS.COM.BR",
      "Cel do responsável ": 11948115422,
      "Cidade ": "SAO PAULO",
      "Estado ": "SP",
      "Quant. Colaboradores": 25,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 15,
      "Quant. projetos Shopify ": 3,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER, QUADRANTE",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "EM ANDAMENTO ",
      "Parceria com Franquia ": "TOTVS IBIRAPUERA ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "https:\/\/www.atacadojandaia.com.br\/ - https:\/\/www.vizzela.com.br\/ - https:\/\/www.doctorsfirst.com.br\/",
      "Quant. projetos implantados VTEX ": 180,
      "Principais projetos implantados SHOPIFY ": "https:\/\/yoclothing.com.br\/ - ",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": 35,
      "Tempo médio de implantação VTEX ": "140 dias"
     },
     {
      "Nome Agência ": "Myeshop",
      "Site Agência ": "Myeshop.com.br",
      "Nome responsável ": "Fabio Michels",
      "E-mail do resposável ": "fabio@myeshop.com.br",
      "Cel do responsável ": 61999810561,
      "Cidade ": "Brasília",
      "Estado ": "Df",
      "Quant. Colaboradores": 12,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 20,
      "Quant. projetos Shopify ": 15,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "EM ANDAMENTO ",
      "Parceria com Franquia ": "TOTVS BRASIL CENTRAL ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "https:\/\/www.gokursos.com http:\/\/garminstore.com.br https:\/\/www.lojabelgo.com.br\/",
      "Quant. projetos implantados VTEX ": "+150",
      "Principais projetos implantados SHOPIFY ": "https:\/\/www.shopbritto.com https:\/\/olera.com.br https:\/\/priscilamokdissi.com",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": "60 dias",
      "Tempo médio de implantação VTEX ": 120
     },
     {
      "Nome Agência ": "Mofo Design",
      "Site Agência ": "https:\/\/mofodesign.com.br\/",
      "Nome responsável ": "Rafael Barboza Soares",
      "E-mail do resposável ": "rafael@mofodesign.com.br",
      "Cel do responsável ": 11961318983,
      "Cidade ": "São Caetano do Sul",
      "Estado ": "SP",
      "Quant. Colaboradores": 15,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 25,
      "Quant. projetos Shopify ": 60,
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Reprovado",
      "OBS\/Motivo ": "Reprovado, pois só consta um sócio , ja sinalizei agência ",
      "Atuante na plataforma VTEX ": "NÃO",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados SHOPIFY ": "https:\/\/www.recargaclub.com.br\/, https:\/\/www.demodeatelie.com.br\/, https:\/\/trocatech.com.br\/",
      "Possui arquiteto ": "NÃO ",
      "Tempo médio de implantação Shopify ": 55
     },
     {
      "Nome Agência ": "Aventum",
      "Site Agência ": "Aventum.com.br",
      "Nome responsável ": "Bruno  Dallan",
      "E-mail do resposável ": "Bruno.dallan@aventum.com.br",
      "Cel do responsável ": 41988874213,
      "Cidade ": "Cascavel",
      "Estado ": "PR",
      "Quant. Colaboradores": 12,
      "Tempo de mercado ": "ATÉ 3 ANOS",
      "Capacidade simultanea de implatação de projeto ": "Varia muito do projeto. Considerando Shopify: 5-8 em paralelo. Estamos montando estrutura para atender exclusivamente projetos de Shopify ",
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Reprovado",
      "OBS\/Motivo ": "Reprovado  - Identificamos que este candidato possui empresa unipessoal e não homologamos empresas de um único sócio.",
      "Atuante na plataforma VTEX ": "NÃO",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Possui arquiteto ": "NÃO "
     },
     {
      "Nome Agência ": "Sirius Digital ",
      "Site Agência ": "www.siriusdigital.com.br",
      "Nome responsável ": "Kenny Roger Martins",
      "E-mail do resposável ": "kenny.martins@siriusdigital.com.br",
      "Cel do responsável ": 27981676481,
      "Cidade ": "Vila Velha",
      "Estado ": "ES",
      "Quant. Colaboradores": 3,
      "Tempo de mercado ": "ATÉ 3 ANOS",
      "Capacidade simultanea de implatação de projeto ": 1,
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SEM CERTIFICAÇÃO ",
      "Homologado TOTVS ": "Sem interesse ",
      "OBS\/Motivo ": "Aguardando documentação ",
      "Parceria com Franquia ": "TOTVS LESTE ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "https:\/\/www.sipolatti.com.br\/, https:\/\/www.frettahome.com.br\/, https:\/\/www.copacabana-use.com\/, https:\/\/www.navegamer.com.br\/, https:\/\/loja.daten.com.br\/",
      "Quant. projetos implantados VTEX ": 25,
      "Possui arquiteto ": "NÃO",
      "Tempo médio de implantação VTEX ": 90
     },
     {
      "Nome Agência ": "Shakers ",
      "Site Agência ": "www.shakersagencia.com.br",
      "Nome responsável ": "Frederico Giordano Perusin",
      "E-mail do resposável ": "frederico@shakersagencia.com.br",
      "Cel do responsável ": 11999677205,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 16,
      "Tempo de mercado ": "ATÉ 2 ANOS",
      "Capacidade simultanea de implatação de projeto ": "Depende da complexidade do projeto, mas na média 15 projetos.",
      "Quant. projetos Shopify ": "Acima de 40",
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "Confecção de contrato 01\/08 GFC-173",
      "Atuante na plataforma VTEX ": "NÃO",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados SHOPIFY ": "Scarfme, Woolie, Skab, Hotmakeup",
      "Possui arquiteto ": "NÃO ",
      "Tempo médio de implantação Shopify ": "50 dias"
     },
     {
      "Nome Agência ": "Jobspace Creative",
      "Site Agência ": "https:\/\/jobspace.com.br\/",
      "Nome responsável ": "Jobspace Creative",
      "E-mail do resposável ": "nicole@jobsx.com.br",
      "Cel do responsável ": 41996993461,
      "Cidade ": "Curitiba",
      "Estado ": "PR",
      "Quant. Colaboradores": 42,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 4,
      "Quant. projetos Shopify ": 0,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Reprovado",
      "OBS\/Motivo ": "Reprovado pelo CNAES",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO",
      "Principais projetos implantados VTEX ": "www.britania.com.br\/ www.philco.com.br \/www.docg.com.br \/www.vapza.com.br",
      "Quant. projetos implantados VTEX ": "50 +",
      "Principais projetos implantados SHOPIFY ": 0,
      "Possui arquiteto ": "NÃO",
      "Tempo médio de implantação Shopify ": "60 dias",
      "Tempo médio de implantação VTEX ": "90 dias"
     },
     {
      "Nome Agência ": "Alfinet",
      "Site Agência ": "www.alfinet.com.br",
      "Nome responsável ": "Guilherme Henrique Balbino de Oliveira",
      "E-mail do resposável ": "guilherme@alfinet.com.br",
      "Cel do responsável ": 34991347500,
      "Cidade ": "Uberlândia",
      "Estado ": "MG",
      "Quant. Colaboradores": 15,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 10,
      "Quant. projetos Shopify ": 130,
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "Chamado aberto GFC-560\n",
      "Atuante na plataforma VTEX ": "NÃO",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados SHOPIFY ": "holysoup.com.br\nfueltech.com.br (essa semana)\ncadernointeligente.com.br\nlubs.com.br\npretorian.com.br\ntailorsmind.com.br\nkonjacmassamf.com\n\netc",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": "50 dias úteis (possível reduzir pela metade pelo dobro do valor) Limite 7 dias úteis"
     },
     {
      "Nome Agência ": "Buda Digital",
      "Site Agência ": "budadigital.com.br",
      "Nome responsável ": "Alexandre Reganati",
      "E-mail do resposável ": "areganati@budadigital.com.br",
      "Cel do responsável ": 11954834012,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 18,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": "10+",
      "Quant. projetos Shopify ": 192,
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "Documentação enviada com os ajustes GFC-365",
      "Atuante na plataforma VTEX ": "NÃO",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados SHOPIFY ": "- Havaianas Latam (Mexico, Uruguay, Argentina, Chile, Colombia, Peru, Costa Rica, Belize) \n\n- Simple Organic\n\n- Zissou \n\n- Arezzo US\n\n- Valid",
      "Possui arquiteto ": "SIM ",
      "Tempo médio de implantação Shopify ": "De 20 a 60 dias úteis"
     },
     {
      "Nome Agência ": "Econverse",
      "Site Agência ": "https:\/\/www.econverse.com.br\/",
      "Nome responsável ": "Bianca Jardim de Oliveira",
      "E-mail do resposável ": "bianca@agenciaeconverse.com.br",
      "Cel do responsável ": 11958507385,
      "Cidade ": "São Paulo",
      "Estado ": "SP",
      "Quant. Colaboradores": 50,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Capacidade simultanea de implatação de projeto ": 13,
      "Quant. projetos Shopify ": 30,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "QUADRANTE",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "25\/09 - Contrato assinado Chamado aberto GFC-388",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "B.Blend, Integral Médica, Seara Comer Bem e Atlético Mineiro.",
      "Quant. projetos implantados VTEX ": 432,
      "Principais projetos implantados SHOPIFY ": "www.zissou.com - www.taniab.com - www.macrobaby.com",
      "Possui arquiteto ": "SIM",
      "Tempo médio de implantação Shopify ": "50 dias úteis com Layout",
      "Tempo médio de implantação VTEX ": "45 dias úteis com layout"
     },
     {
      "Nome Agência ": "Método\/ Figi ",
      "Site Agência ": "https:\/\/sejafigi.com.br\/totvs\/",
      "Nome responsável ": "Douglas Agencia Metodo ",
      "E-mail do resposável ": "douglas@sejafigi.com.br",
      "Cel do responsável ": 8498196538,
      "Cidade ": "Natal ",
      "Estado ": "RN",
      "Tempo de mercado ": "ATÉ 5 ANOS ",
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "QUADRANTE",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "Concluido 22\/08 ",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Possui arquiteto ": "SIM "
     },
     {
      "Nome Agência ": "Fit Gestão ",
      "Site Agência ": "fitgestao.com.br",
      "Nome responsável ": "Bruno Fit Gestao ",
      "E-mail do resposável ": "bruno.araujo@fitgestao.com",
      "Cel do responsável ": 11971849364,
      "Cidade ": "Guarulhos",
      "Estado ": "SP ",
      "Quant. Colaboradores": 45,
      "Tempo de mercado ": "ATÉ 5 ANOS ",
      "Capacidade simultanea de implatação de projeto ": 10,
      "Quant. projetos Shopify ": 0,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "contrato finalizado ",
      "Atuante na plataforma VTEX ": "SIM ",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "Futuro.digital (Senai), Rohto Mentholatum, Vai vinho",
      "Quant. projetos implantados VTEX ": 12,
      "Possui arquiteto ": "SIM ",
      "Tempo médio de implantação VTEX ": "90 dias "
     },
     {
      "Nome Agência ": "Codeblue",
      "Site Agência ": "www.codeblue.com.br",
      "Nome responsável ": "Diego Luís Perly Monteiro",
      "E-mail do resposável ": "diego@codeblue.com.br",
      "Cel do responsável ": 41997429756,
      "Cidade ": "Curitiba",
      "Estado ": "PR",
      "Quant. Colaboradores": 15,
      "Tempo de mercado ": "ATÉ 3 ANOS",
      "Capacidade simultanea de implatação de projeto ": 5,
      "Quant. projetos Shopify ": 150,
      "Certificado ": "VTEX",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Homologado",
      "OBS\/Motivo ": "contrato finalizado ",
      "Atuante na plataforma VTEX ": "SIM ",
      "Atuante na plataforma Shopify ": "NÃO ",
      "Principais projetos implantados VTEX ": "Sépha, Bergerson, Kapazi",
      "Quant. projetos implantados VTEX ": 150,
      "Possui arquiteto ": "SIM ",
      "Tempo médio de implantação VTEX ": "60 dias "
     },
     {
      "Nome Agência ": "Branchstack - Bs",
      "Site Agência ": "https:\/\/www.branchstack.com",
      "Nome responsável ": "Italo Leme dos Santos",
      "E-mail do resposável ": "italo.leme@branchstack.com",
      "Cel do responsável ": "1197573-3523",
      "Cidade ": "Osasco",
      "Estado ": "SP ",
      "Quant. Colaboradores": 27,
      "Tempo de mercado ": "MAIS DE 5 ANOS",
      "Quant. projetos Shopify ": 20,
      "Certificado ": "VTEX e SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "PARTNER",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS",
      "Homologado TOTVS ": "Reprovado",
      "OBS\/Motivo ": "Análise Financeira reprovada. Sócios possuem apontamento em seus CPFs. Chamado aberto GFC-388",
      "Atuante na plataforma VTEX ": "SIM",
      "Atuante na plataforma Shopify ": "SIM",
      "Principais projetos implantados VTEX ": "https:\/\/www.integralmedica.com.br, https:\/\/www.darkness.com.br, https:\/\/www.stroke.com.br, https:\/\/www.talcha.com.br",
      "Principais projetos implantados SHOPIFY ": "https:\/\/wessel.com.br, https:\/\/br.deuscustoms.com, https:\/\/omeuchip.com",
      "Possui arquiteto ": "SIM ",
      "Tempo médio de implantação Shopify ": "120 DIAS ",
      "Tempo médio de implantação VTEX ": "120 DIAS "
     },
     {
      "Nome Agência ": "Alce Rocks",
      "Site Agência ": "www.alce.rocks",
      "Nome responsável ": "Igor de Andrade",
      "E-mail do resposável ": "contato@alce.rocks",
      "Cel do responsável ": "1705333 4449",
      "Cidade ": "São Paulo",
      "Estado ": "SP ",
      "Quant. Colaboradores": 10,
      "Tempo de mercado ": "10 anos",
      "Capacidade simultanea de implatação de projeto ": 10,
      "Quant. projetos Shopify ": 100,
      "Certificado ": "SHOPIFY ",
      "Certificado\/ Homologado VTEX ": "SEM CERTIFICAÇÃO ",
      "Certificação Shopify ": "SHOPIFY FOUNDATIONS, SHOPIFY PLUS",
      "Homologado TOTVS ": "Aguardando documentação ",
      "Parceira RD STATION ": "SIM "
     }
    ],
    "CASES POR AGÊNCIA ":[
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/www.labellamafia.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/www.arezzo.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/www.schutz.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/www.alexandrebirman.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/simpleorganic.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/carenb.com\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/coffeemais.com\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Café "
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/www.camilaklein.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Jóias e Bijuterias"
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/homedock.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Homedecor"
     },
     {
      "AGÊNCIA": "CheckStore Full E-commerce",
      "SITE ": "https:\/\/www.volcom.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.jequiti.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.portobrasilceramica.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Homedecor"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.panamericana.com.co\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Papelaria"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.umusicstore.com\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Objetos Musicais"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.ironstudios.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Artigos Colecionáveis"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.tvz.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.libresse.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Higiene Descartáveis"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.bagaggio.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Malas de Viagem "
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.manole.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Infoproduto"
     },
     {
      "AGÊNCIA": "Maeztra",
      "SITE ": "https:\/\/www.emporiovivendadocamarao.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Alimentício"
     },
     {
      "AGÊNCIA": "Vinci ",
      "SITE ": "https:\/\/www.carone.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Supermercado "
     },
     {
      "AGÊNCIA": "Vinci ",
      "SITE ": "https:\/\/www.portofrescatto.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Alimentício"
     },
     {
      "AGÊNCIA": "Vinci ",
      "SITE ": "https:\/\/www.garminstore.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Vinci ",
      "SITE ": "https:\/\/gringa.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Disco",
      "SITE ": "https:\/\/www.oriba.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Disco",
      "SITE ": "https:\/\/www.comprecimed.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Farmácia"
     },
     {
      "AGÊNCIA": "Disco",
      "SITE ": "https:\/\/www.gummyhair.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Beleza "
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.crsbrands.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Bebidas"
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.pierrecardin.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.gregory.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.brooksdonna.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.lojastorra.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.probel.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Cama e Colchão"
     },
     {
      "AGÊNCIA": "Agência e-Plus ",
      "SITE ": "https:\/\/www.campneus.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Pneus "
     },
     {
      "AGÊNCIA": "Eazy Go",
      "SITE ": "https:\/\/www.maxior.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Joias e Bijuterias"
     },
     {
      "AGÊNCIA": "Eazy Go",
      "SITE ": "https:\/\/www.kayland.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Eazy Go",
      "SITE ": "www.liway.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Papelaria"
     },
     {
      "AGÊNCIA": "Benova",
      "SITE ": "https:\/\/uau.bobinex.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Homedecor"
     },
     {
      "AGÊNCIA": "Benova",
      "SITE ": "https:\/\/loja.karcher.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Equipamentos de Limpeza "
     },
     {
      "AGÊNCIA": "Benova",
      "SITE ": "https:\/\/www.crocs.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "CRP Mango",
      "SITE ": "https:\/\/www.segredosdesalao.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Beleza "
     },
     {
      "AGÊNCIA": "CRP Mango",
      "SITE ": "https:\/\/www.edona.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Departamento"
     },
     {
      "AGÊNCIA": "CRP Mango",
      "SITE ": "https:\/\/www.skinceuticals.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Beleza "
     },
     {
      "AGÊNCIA": "Codeby",
      "SITE ": "https:\/\/mercado.carrefour.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Supermercado "
     },
     {
      "AGÊNCIA": "Codeby",
      "SITE ": "https:\/\/shoppingleblon.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Shopping"
     },
     {
      "AGÊNCIA": "Codeby",
      "SITE ": "https:\/\/www.santalolla.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Codeby",
      "SITE ": "https:\/\/it.canali.com",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Codeby",
      "SITE ": "https:\/\/waaw.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "Codeby",
      "SITE ": "https:\/\/www.squeem.com\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Lingerie"
     },
     {
      "AGÊNCIA": "TDZAIN",
      "SITE ": "https:\/\/annabbags.com\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Bolsas e Acessórios "
     },
     {
      "AGÊNCIA": "TDZAIN",
      "SITE ": "https:\/\/www.bigben.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Jóias e Bijuterias"
     },
     {
      "AGÊNCIA": "TDZAIN",
      "SITE ": "https:\/\/www.nichele.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Material de Construção "
     },
     {
      "AGÊNCIA": "TDZAIN",
      "SITE ": "https:\/\/www.cassol.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Material de Construção "
     },
     {
      "AGÊNCIA": "Simples.Inovação",
      "SITE ": "https:\/\/www.blueman.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Simples.Inovação",
      "SITE ": "https:\/\/www.ekazza.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Equipamentos de Construção "
     },
     {
      "AGÊNCIA": "Simples.Inovação",
      "SITE ": "https:\/\/www.fiberoficial.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "2B DIGITAL",
      "SITE ": "https:\/\/www.atacadojandaia.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Papelaria"
     },
     {
      "AGÊNCIA": "2B DIGITAL",
      "SITE ": "https:\/\/www.vizzela.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "2B DIGITAL",
      "SITE ": "https:\/\/www.atacadojandaia.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Papelaria"
     },
     {
      "AGÊNCIA": "2B DIGITAL",
      "SITE ": "https:\/\/yoclothing.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Myeshop",
      "SITE ": "https:\/\/www.lojabelgo.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Agro"
     },
     {
      "AGÊNCIA": "Myeshop",
      "SITE ": "http:\/\/garminstore.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Myeshop",
      "SITE ": "https:\/\/www.gokursos.com",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Infoproduto"
     },
     {
      "AGÊNCIA": "Myeshop",
      "SITE ": "https:\/\/priscilamokdissi.com",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Jóias e Bijuterias"
     },
     {
      "AGÊNCIA": "Myeshop",
      "SITE ": "https:\/\/olera.com.br",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "Myeshop",
      "SITE ": "https:\/\/www.shopbritto.com",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Objetos Artistícos"
     },
     {
      "AGÊNCIA": "Agência Mofo Design",
      "SITE ": "https:\/\/trocatech.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "Agência Mofo Design",
      "SITE ": "https:\/\/www.demodeatelie.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Agência Mofo Design",
      "SITE ": "https:\/\/www.recargaclub.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Indústria"
     },
     {
      "AGÊNCIA": "Sirius Digital ",
      "SITE ": "https:\/\/loja.daten.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "Sirius Digital ",
      "SITE ": "https:\/\/www.navegamer.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "Sirius Digital ",
      "SITE ": "https:\/\/www.copacabana-use.com",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Moda"
     },
     {
      "AGÊNCIA": "Sirius Digital ",
      "SITE ": "https:\/\/www.frettahome.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Cama, mesa, banho"
     },
     {
      "AGÊNCIA": "Sirius Digital ",
      "SITE ": "https:\/\/www.sipolatti.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "Jobspace Creative",
      "SITE ": "www.vapza.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Industrializados"
     },
     {
      "AGÊNCIA": "Jobspace Creative",
      "SITE ": "\/www.docg.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Pet"
     },
     {
      "AGÊNCIA": "Jobspace Creative",
      "SITE ": "www.philco.com.br",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "Jobspace Creative",
      "SITE ": "www.britania.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Eletrodoméstico"
     },
     {
      "AGÊNCIA": "Alfinet",
      "SITE ": "https:\/\/fueltech.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Automotivo"
     },
     {
      "AGÊNCIA": "Alfinet",
      "SITE ": "https:\/\/holysoup.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Alimentício"
     },
     {
      "AGÊNCIA": "Alfinet",
      "SITE ": "https:\/\/lubs.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "Alfinet",
      "SITE ": "https:\/\/pretorian.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Automotivo"
     },
     {
      "AGÊNCIA": "Alfinet",
      "SITE ": "https:\/\/tailorsmind.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Moda "
     },
     {
      "AGÊNCIA": "Alfinet",
      "SITE ": "https:\/\/konjacmassamf.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Alimentício"
     },
     {
      "AGÊNCIA": "Buda Digital",
      "SITE ": "https:\/\/simpleorganic.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Cosmeticos"
     },
     {
      "AGÊNCIA": "Econverse",
      "SITE ": "https:\/\/loja.bblend.com.br\/",
      "PLATAFORMA ": "VTEX ",
      "SEGMENTO ": "Café "
     },
     {
      "AGÊNCIA": "Econverse",
      "SITE ": "https:\/\/www.macrobaby.com\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Equipamentos Infantis"
     },
     {
      "AGÊNCIA": "Econverse",
      "SITE ": "https:\/\/www.zissou.com.br\/",
      "PLATAFORMA ": "SHOPIFY ",
      "SEGMENTO ": "Cama e Colchão"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.rohtobrasil.com.br\/",
      "PLATAFORMA ": "VTEX",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Beleza"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.rohtobrasil.com.br\/",
      "PLATAFORMA ": "RD Marketing",
      "Especialidade B2B B2C": "B2C\\B2B",
      "SEGMENTO ": "Beleza"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.greatek.com.br\/",
      "PLATAFORMA ": "VTEX",
      "Especialidade B2B B2C": "B2C\\B2B",
      "SEGMENTO ": "Eletrônicos"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.futuro.digital\/",
      "PLATAFORMA ": "VTEX",
      "Especialidade B2B B2C": "B2C\\B2B",
      "SEGMENTO ": "Educacional"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.futuro.digital\/",
      "PLATAFORMA ": "TAIL CMP",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Educacional"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/loja.imperiodastintas.com.br\/",
      "PLATAFORMA ": "VTEX (legado)",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Casa e Construção"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.showdeotica.com.br\/",
      "PLATAFORMA ": "VTEX (legado)",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Ótica"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/www.priacessorios.com.br\/",
      "PLATAFORMA ": "VTEX (legado)",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Moda e Acessórios"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/supadist.com\/",
      "PLATAFORMA ": "Magento",
      "Especialidade B2B B2C": "B2C\\B2B",
      "SEGMENTO ": "Esporte"
     },
     {
      "AGÊNCIA": "FIT Gestão",
      "SITE ": "https:\/\/heartmerch.com.br\/",
      "PLATAFORMA ": "Woocommerce (Migrando para Shopify)",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Moda e Acessórios"
     }
    ],
    "Página6":[
     {
      "AGÊNCIA": "Eplus ",
      "SITE ": "XXXXX",
      "PLATAFORMA ": "Shopify ",
      "Especialidade B2B B2C": "B2C",
      "SEGMENTO ": "Moda "
     },
     {
      "SITE ": "XXXXX",
      "PLATAFORMA ": "VTEX ",
      "Especialidade B2B B2C": "B2B",
      "SEGMENTO ": "Farmacia "
     },
     {
      "SITE ": "XXXXX",
      "PLATAFORMA ": "TRAY ",
      "Especialidade B2B B2C": "B2C ",
      "SEGMENTO ": "Supermercado "
     }
    ],
    "Agências Homologadas VTEX ":[]
    };

    let agenciasHomologadas = agencias.agencias.filter(aga => aga["Homologado TOTVS "].toLowerCase().trim() == 'homologado');

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
app.use(("/agenciasfila/", router))
app.use(("/cadastroagencia/", router))
app.use(("/cadastroprojetos/", router))
let encodeUrl = bodyParser.urlencoded({ extended: false });

let projetos = []

let clientes = [];

let cliente = {id: 0, 
               nome: 'Maeztra',
               regiao: 'sudeste',
               nps: 8,
               parceiro: 'partner',
               logistica: true,
               varejo: false,
               construcao: true,
               distribuicao: false,
               b2b: true,
               b2c: false,
               b2b2c: true,
               b2b2b: false,
               marketplace:true,
               next: 1};

clientes.push(cliente);

let contAgencia = 0;

let cliente1 = {id: 1, 
    nome: 'Disco',
    regiao: 'sudeste',
    nps: 8,
    parceiro: 'plus',
    logistica: true,
    varejo: false,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: false,
    b2b2c: true,
    b2b2b: false,
    marketplace:true,
    next: 2};

clientes.push(cliente1);   


let cliente2 = {id: 2, 
    nome: 'E-Plus',
    regiao: 'sudeste',
    nps: 8,
    parceiro: 'plus',
    logistica: true,
    varejo: false,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: false,
    b2b2c: true,
    b2b2b: false,
    marketplace:true,
    next: 3};

clientes.push(cliente2);   


let cliente3 = {id: 3, 
    nome: 'CRP MANGO',
    regiao: 'norte',
    nps: 8,
    parceiro: 'partner',
    logistica: false,
    varejo: true,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: false,
    b2b2c: false,
    b2b2b: false,
    marketplace:true,
    next: 4};

clientes.push(cliente3);   
 
let cliente4 = {id: 4, 
    nome: '2B Digital',
    regiao: 'sul',
    nps: 8,
    parceiro: 'partner',
    logistica: false,
    varejo: true,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: false,
    b2b2c: false,
    b2b2b: false,
    marketplace:true,
    next:5};

clientes.push(cliente4);   

let cliente5 = {id: 5, 
    nome: 'Buda Digital',
    regiao: 'sul',
    nps: 8,
    parceiro: 'plus',
    logistica: true,
    varejo: true,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: true,
    b2b2c: true,
    b2b2b: false,
    marketplace:false,
    next: 6};

clientes.push(cliente5); 

let cliente6 = {id: 6, 
    nome: 'Econoverse',
    regiao: 'sudeste',
    nps: 6,
    parceiro: 'plus',
    logistica: true,
    varejo: true,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: true,
    b2b2c: true,
    b2b2b: false,
    marketplace:false,
    next: 7};

clientes.push(cliente6);   

let cliente7 = {id: 7, 
    nome: 'Fit Gestão',
    regiao: 'sudeste',
    nps: 9,
    parceiro: 'plus',
    logistica: true,
    varejo: true,
    construcao: true,
    distribuicao: false,
    b2b: true,
    b2c: true,
    b2b2c: true,
    b2b2b: false,
    marketplace:false,
    };

clientes.push(cliente7);   

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

app.get('/api/v1/clientes/ultimo/', (req, res) => {
    validaToken(req);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clientes[clientes.length -1].id));
});

app.get('/api/v1/clientes/primeiro/', (req, res) => {
    validaToken(req);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clientes[0].id));
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


app.get('/api/v1/clientes/', (req, res) => {
    validaToken(req);
    console.log("get no metodo de listagem de clientes");

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clientes));
});    

app.get('/api/v1/clientes/:id', (req, res) => {
    validaToken(req);
   
    
    let clienteLocalizado = clientes.find(cliente => cliente.id == req.params.id);
    if (req.params.id == 0 && clienteLocalizado == null) {
        clienteLocalizado = clientes[0];
    }

    let posicao = clientes.indexOf(clienteLocalizado);
    

    let posanterior = posicao - 1;
    let posproximo = parseInt(req.params.id) + 1
   
    let cliAnterior = clientes[posanterior];
    let cliPosterior = clientes.find(cliente => cliente.id >= posproximo);
    if (cliAnterior != null) {
        clienteLocalizado.prev = cliAnterior.id;
    } 

    if (cliPosterior != null) {
       
        clienteLocalizado.next = cliPosterior.id;
    } else {
        clienteLocalizado.next = null;
    }


    let statusHttp = 200;

    if (clienteLocalizado == null) {
        statusHttp = 404;
    }

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(clienteLocalizado));

});

app.get('/api/v1/sugestaoagencia/nome/:nome', (req, res) => {
   
    let agenciasdoCliente = mapaAgenciaClient.get(req.params.nome);
    let statusHttp = 200;
   

    res.writeHead(statusHttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(agenciasdoCliente));

});


app.get('/api/v1/sugestaoagencia/nome/:nome/next/:next', (req, res) => {
   
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

    for (let iag = 0; iag < agenciasHomologadas.length; iag++) {
        let agenciasugerida = agenciasHomologadas[iag];
        let nomeAgencia = agenciasugerida['Nome Agência '].toLowerCase().trim();
        ;

        if (!agenciasugerida["Homologado TOTVS "].toLowerCase().trim() == 'homologado') continue
        
        let score = 3000 - (iag * 200);
        if (agenciasugerida["Atuante na plataforma Shopify "] != undefined && agenciasugerida["Atuante na plataforma Shopify "].toLowerCase().trim() == 'sim') {

            
            score = score + 100
        }

        let qtprojetos = 0;
        
        if (agenciasugerida["Quant. projetos Shopify "] != undefined) {

            if (typeof agenciasugerida["Quant. projetos Shopify "] == 'string') {
                qtprojetos = Number.parseInt(agenciasugerida["Quant. projetos Shopify "].match(/(\d+)/)[0]);
            } else if (typeof agenciasugerida["Quant. projetos Shopify "] == 'number') {
                qtprojetos = agenciasugerida["Quant. projetos Shopify "]
            }

            score = score + qtprojetos;
        }    

        if (agenciasugerida['Certificação Shopify '].toLowerCase().trim().indexOf('foundation')) {
            score = score + 100;
        }

        if (agenciasugerida['Certificação Shopify '].toLowerCase().trim().indexOf('plus')) {
            score = score + 200;

            if (sugestao.shopifyplus) {
                score = score + 500;
            }
        }

       

        if (nomeAgencia.indexOf(sugestao.agencia.toLowerCase().trim()) > -1) {
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

            if (caso['PLATAFORMA '].toLowerCase().indexOf("shopify") > -1) {
                plataformCaseScore = 500;
            }

            if (caso['SEGMENTO '].toLowerCase().indexOf(sugestao.segmento) > -1) {
                segmentoCaseScore = 1000;
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


        agenciasugerida.score = score;
       // agenciasugerida.cliente = sugestao.nome;
        agenciasSugeridas.push(agenciasugerida);
    }

    agenciasSugeridas.sort((a, b) => (a.score < b.score ? 1 : -1));

    mapaAgenciaClient.set(sugestao.nome, agenciasSugeridas);

   

   console.log("primeira agencia sugerida como resposta");
    
   
    console.log(agenciasSugeridas[0])
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
    let agenciaalocada = agencias.agencias.find(a => a['Nome Agência '].toLowerCase() == projeto['Nome Agência '].toLowerCase());
    console.log("Agencia localizada " + agenciaalocada['Nome Agência ']);
    console.log("posicao da agencia " + agencias.agencias.indexOf(agenciaalocada)) ;

    let posicaoAtual = agencias.agencias.indexOf(agenciaalocada);
    let posicaofinal = agencias.agencias.length - 1;

    array_move(agencias.agencias, posicaoAtual, posicaofinal );


    
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

app.post('/api/v1/clientes/', encodeUrl, (req, res) => {
	
	//throw("Explosões!!!!!!");
    validaToken(req);
    console.log("post de cliente");
    let codigoStatushttp = 201;
    let novoCliente = req.body;

    let maiorid = Math.max(...clientes.map( o => o.id ));

    
    if (maiorid > 0) {
        maiorid++;
    } else {
        maiorId = 1;
    }

    novoCliente.id = maiorid;
    clientes.push(novoCliente);

    res.writeHead(codigoStatushttp, {"Content-Type": "application/json"});
    res.end(JSON.stringify(novoCliente));

});
//
app.put('/api/v1/clientes/:id',  encodeUrl, (req, res) => {
   
    
    validaToken(req);
    
    console.log(req);
	
	//throw("Explosões!!!!!!");


    let clienteAntigo = clientes.find(cliente => cliente.id == req.params.id);
    if (clienteAntigo == null) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify("Cliente não localizado com o id " + req.params.id));
    } else {
        let novoCliente = req.body;
        let campos = ['id','nome','regiao','parceiro','nps', 'prev', 'next'];
             console.log("Validando campos ");

            console.log(novoCliente);

        //if (Object.keys(novoCliente).some(o => campos.includes(o))) {
            console.log("Achou os campos");
            clienteAntigo.nome = novoCliente.nome;
            clienteAntigo.regiao = novoCliente.regiao;
            clienteAntigo.parceiro = novoCliente.parceiro;
            clienteAntigo.nps = novoCliente.nps;

            clienteAntigo.logistica = novoCliente.logistica;
            clienteAntigo.distribuicao = novoCliente.distribuicao;
            clienteAntigo.construcao = novoCliente.construcao;
            clienteAntigo.fabrica = novoCliente.fabrica;

            clienteAntigo.b2b = novoCliente.b2b;
            clienteAntigo.b2c = novoCliente.b2c;
            clienteAntigo.b2b2c = novoCliente.b2b2c;
            clienteAntigo.b2b2b = novoCliente.b2b2b;
			
			clienteAntigo.marketplace = novoCliente.marketplace;

            console.log("clienteAntigo.nps " + clienteAntigo.nps);

            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify(clienteAntigo));


       // } else {
            //res.writeHead(400, {"Content-Type": "application/json"});
            //res.end(JSON.stringify("Objeto JSon de cliente Inválido! "));
        //}
    }
});

app.delete('/api/v1/clientes/:id' , (req, res) => {
    //validaToken(req);
    console.log('delete req.params.id ' + req.params.id);
    let clienteaDeletar = clientes.find(cliente => cliente.id == req.params.id);
    if (clienteaDeletar == null) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end(JSON.stringify("Cliente não existe com o código " + req.params.id ));
    } else {
        let posicao = clientes.indexOf(clienteaDeletar);
        console.log("posicao " + posicao);
        clientes.splice(posicao, 1);
        if (clientes[posicao +1] != null) {
            posicao = clientes[posicao +1].id;
        } else {
            posicao = clientes[posicao - 1].id;
        }
        res.writeHead(201, {"Content-Type": "application/json"});
        res.end(JSON.stringify(posicao));
    }

});

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



app.listen(5001, () => {
    console.log("Aplicação de API subiu na porta 5001");
});


