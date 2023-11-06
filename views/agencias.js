let tableAgencias;
let homologadas = false;


function prepararAgencias(agencias) {

    for (let contadorAgencia = 0; contadorAgencia < agencias.length; contadorAgencia++) {
        let agencia = agencias[contadorAgencia];

    
    
        if (agencia['Homologado TOTVS '].toLowerCase().indexOf('homologado') > -1) {
            agencia.totvs = true;
        } else {
            agencia.totvs = false;
        }

        if (agencia['Certificação Shopify '].toLowerCase().indexOf('foundations') > -1) {
            agencia.shopify = true;
        } else {
            agencia.shopify = false;
        }

        if (agencia['Certificação Shopify '].toLowerCase().indexOf('plus') > -1) {
            agencia.plus = true;
        } else {
            agencia.plus = false;
        }
    }    
    return agencias;

}

function carregaAgencias() {
    var tabledata = [];

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            Headers: myHeaders,
            redirect: 'follow'
        };

        fetch("../api/v1/agencias/", requestOptions)
        .then(response => response.json())
        .then(result => {tabledata = prepararAgencias(result);
           

            tableAgencias = new Tabulator("#example-table", {
                    height:"311px",
                    data:tabledata,
                    renderHorizontal:"virtual",
                    columns:[
                        {title:"Agência", field:"Nome Agência ", width:200, editor:false},
                        {title:"Homologado", field:"totvs", hozAlign:"center", editor:false, formatter:"tickCross"},
                        {title:"Responsável", field:"Nome responsável ", width:130, editor:"list", editorParams:{autocomplete:"true", allowEmpty:true,listOnEmpty:true, valuesLookup:true}},
                        //{title:"Cidade", field:"Cidade ", width:100},
                        //{title:"UF", field:"Estado ", width:60},
                        {title:"Shopify", field:"shopify", hozAlign:"center", editor:false, formatter:"tickCross"},
                        {title:"Plus", field:"plus", hozAlign:"center", editor:false, formatter:"tickCross"},
                        {title:"Último Score", field:"score", hozAlign:"center", width:130},
                        {title:"#Fila", field:"posicaoFila", hozAlign:"center", width:110},
                        {title:"Projetos", field:"qtProj", hozAlign:"center", width:110}
                        
                    ],
            })
        })
        .catch(error => console.log(error));
}

function atualizaAgencias() {
    var tabledatanew = [];
    let url = "../api/v1/agencias/";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        Headers: myHeaders,
        redirect: 'follow'
    };

    if (homologadas) {
        url = "/api/v1/agencias/homologadas";
    } else {
        url = "/api/v1/agencias";
    }


    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {tabledatanew = prepararAgencias(result);
       
        tableAgencias.replaceData(tabledatanew);
        //tableAgencias.data
    })
    .catch(error => console.log(error));
}

function filtraHomologadas() {
    console.log('filtro ' + homologadas);
    
    if (homologadas) {
        $("#homologs")[0].innerText = 'Apenas Homologadas';
        homologadas = false;
    } else {
        $("#homologs")[0].innerText = 'Todas';
        homologadas = true;
    }
    atualizaAgencias();
}
