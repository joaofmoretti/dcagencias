//var urlamonitorar = 'http://138.219.88.140/ping';
var urlamonitorar = 'http://localhost:10000/ping';


function rodaAplicacao() {
        var hoje = new Date();
        
        var logfile = "logAplicacao.log"
        console.log(Date());

        var childProcess = require('child_process'), 
        ls;
        //ls = childProcess.exec('node agencias.js > ' + logfile, function (error, stdout, stderr) {

        ls = childProcess.fork('agencias.js');   
}    


function Monitora() {

    fetch(urlamonitorar)
        .then(response => response.text())  // converter para json
        .then(json => { })    //imprimir dados no console
        .catch(err => {
                
                console.log(err.cause.code);
                if (err.cause.code == 'ECONNREFUSED') {
                    
                   rodaAplicacao();
                }   
        });


        setTimeout(Monitora, 10000);    
}
Monitora();