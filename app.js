// var exec = require('child_process').exec;
// exec('NET SESSION', function(err,so,se) {
//       if(se.length !== 0) {
//         alert('Você precisa executar este aplicativo como administrador.\nClique com o botão direito e em "executar como administrador".')
//         var window = remote.getCurrentWindow();
//         window.close();
//       }
//     });


const {ipcRenderer} = require('electron')
var lang = require('./conf/lang/pt-br.js')          //Linguagem do Sistema
var conf = require('./conf/config.js')              //Configurações do Sistema
const remote = require('electron').remote           //Electron remote
let round = require('vue-round-filter')             //Filtro para arrendondar valores
var read = require('read-file-utf8')                //Leitura de arquivos utf-8
var loki = require ('lokijs')                       //Banco de dados
const fileExists = require('file-exists')           //Verificar se o arquivo existe

//Recupera informações do main process
var documentsPath = ipcRenderer.sendSync('request-doc')

//Criando um banco de dados com o LokiJS
var db = new loki(documentsPath+'/Molecule/db.json')
//Verificando se há um banco de dados criado no root do sistema
var check = fileExists.sync(documentsPath+'/Molecule/db.json')
var data = {}


var fs = require('fs');
var settings = JSON.parse(fs.readFileSync(documentsPath + '/Molecule/conf/settings.json', 'utf8'));

//Log personalizado do Sistema (developerMode)
console.log('%c Molecule ', 'background: #24292e; color: #09f');
//Caso exista o banco de dados, ele irá carregar e informar ao usuário via console.
if(check == true){
  data = read(documentsPath+'/Molecule/db.json')
  db.loadJSON(data)
  let colecoes = db['collections'].length
  console.log(lang.successfulDatabaseLoad + colecoes + lang.foundDatabases)
//Caso não encontre o banco de dados, ele irá criar as coleções necessárias e informar ao usuário via console.
} else{
  db.addCollection('vendas')
  db.addCollection('clientes')
  db.addCollection('produtos')
  db.save()
  console.log(lang.createdDatabase + lang.welcomeMessage)
  //Mensagem de boas vindas
  alert(lang.welcomeMessage)
}

//Lendo as coleções e armazenando em variáveis locais
var clientes  =  db.getCollection('clientes')
var produtos  =  db.getCollection('produtos')
var vendas    =  db.getCollection('vendas')

//Importando o VueJS (framework)
window.Vue = require('vue')

//Importando o plugin de máscara do VueJS
window.VueMask = require('v-mask')
Vue.use(VueMask);

//Criando uma diretiva personalizada para clique fora do elemento

Vue.directive('click-outside', {
  priority: 700,
  bind () {
    let self  = this
    this.event = function (event) {
    	self.vm.$emit(self.expression,event)
 	  }
    this.el.addEventListener('click', this.stopProp)
    document.body.addEventListener('click',this.event)
  },

  unbind() {
    this.el.removeEventListener('click', this.stopProp)
    document.body.removeEventListener('click',this.event)
  },
  stopProp(event) {event.stopPropagation() }
})

//Iniciando nossa aplicação com VueJS
var app = new Vue({
  filters: {
    round,
  },
  el: 'body',
  data: {
    settings: this.settings,
    clientes:[],
    produtos:[],
    vendas:[],
    client:{
      nome:'',
      cpf:'',
      telefone:'',
      genero:'',
    },
    product:{
			nome:'',
			preco:'',
			qtd:0
		},
    sale:{
      cliente:'',
      produto:'',
      preco:0,
      qtd:1,
      data:'',
      desconto:0,
    },
    mode:'',
    nomePesquisa:'',
    openModal: false,
    openModalProduct: false,
    openModalSale: false,
    windowTab: 'index',
    documento: 'cpf',
    numero: 'tel',
    menu: '',
    cmd: '',
    cmdQuest: '',
    cmdHistory: [
      {command: 'início'}
    ],
    liveChange: [
      {detail: 'livePush 1.0.0'}
    ],
  },
  ready: function(){
    this.clientes = clientes.data
    this.produtos = produtos.data
		this.vendas = vendas.data
  },
  methods:{
    tabKeyChange: function(){
      if(this.windowTab == 'index'){
        document.addEventListener("keydown", function (e) {
          if (e.which == 89) {
            this.windowTab == 'products'
          } else if (e.which === 79) {
            this.windowTab == 'sales'
          }
        });
      }
    },
    openMenuItem: function(item){
      if(item == 'createClient'){
        this.createClient()
        hideMenu()
      }
    },
    hideMenu: function(){
      this.menu = ''
    },
    openMenu: function(menu){
      this.menu = menu
    },
    tabChange(tab){
      this.windowTab = tab
      if(settings.tabLivePush){
        livePush(lang.tabChanged + tab)
      }
    },
    /*
        Funções referentes a aba clientes
        Ao alterar estas funções, padronize nas demais.
    */
    editClient: function(client){
      this.mode='edicao'
      this.openModal = true;
      this.client = client;
    },
    viewClient: function(client){
      this.mode='visualizar'
      this.openModal = true;
      this.client = client;
    },
    clientDelete: function(){
      var r = confirm(lang.confirmClientDelete);
      if (r == true) {
          console.log(lang.clientSubs + " " + this.client.nome + " " + lang.successfulDeleted);
          clientes.remove(this.client);
          db.save()
          this.openModal=false
      } else {
          console.log(lang.notDelete + lang.clientSubs);
      }
    },
    createClient: function(){
      this.mode='cadastro'
      this.openModal=true
      this.client = {
        nome:'',
        cpf:'',
        telefone:''
      }
      this.menu=false
    },
    clientStoreOrUpdate: function(){
      if(typeof this.client.$loki != 'undefined'){
        clientes.update(this.client)
      } else {
        clientes.insert(this.client)
      }
      db.save()
      console.log(lang.clientSubs + " " + lang.successfulStored)
      this.openModal=false
    },/*
        Funções referentes a aba produtos
        Ao alterar estas funções, padronize nas demais.
    */
    editProduct: function(product){
		  this.mode='edicao'
		  this.openModalProduct = true;
		  this.product = product;
		},
		createProduct: function(){
		  this.mode='cadastro'
		  this.openModalProduct=true
		  this.product = {
		    nome:'',
		    preco:'',
		    qtd:''
		  }
		},
		productDelete: function(){
	    	var r = confirm("Você realmente deseja deletar este produto?");
	        if (r == true) {
	            console.log("Cliente " + this.product.nome + " deletado com sucesso.");
	            produtos.remove(this.product);
	            db.save()
	            this.openModalProduct=false
	        } else {
	            console.log("Você optou por não deletar o produto.");
	        }
	    },
		productStoreOrUpdate: function(){
		  if(typeof this.product.$loki != 'undefined'){
		    produtos.update(this.product)
		  } else {
		    produtos.insert(this.product)
		  }
		  db.save()
		  this.openModalProduct=false
		},/*
        Funções referentes a aba vendas
        Ao alterar estas funções, padronize nas demais.
    */
    deleteSale: function(venda){
      var r = confirm("Você realmente deseja deletar esta venda?");
        if (r == true) {
            vendas.remove(venda);
            db.save()
        } else {
            console.log("Você optou por não deletar a venda.");
        }
    },
    editSale: function(sale){
      this.mode='edicao'
      this.openModalSale = true
      this.sale = sale
    },
    createSale: function(){
      this.mode='cadastro'
      this.openModalSale=true
      this.sale = {
        cliente:'',
      produto:'',
      preco:0,
      qtd:1,
      data:'',
      desconto:10,
    }
    },
    saleStoreOrUpdate: function(){
      if(typeof this.sale.$loki != 'undefined'){
        vendas.update(this.sale)
      } else {
        this.sale.preco = produtos.find({nome:this.sale.produto})[0].preco
        vendas.insert(this.sale)
        for (var i = 0; i < this.produtos.length; i++) {
          if(this.produtos[i]['nome'] == this.sale.produto){
            this.produtos[i]['qtd'] -= this.sale.qtd;
            if(this.produtos[i]['qtd'] < 0){
              alert('Você precisa adicionar mais deste produto no estoque!')
            }
          }
        }
      }
      db.save()
      this.openModalSale=false
    },
    consoleMode: function(cmd){
      this.cmdHistory.push({command: this.cmd})
      if(this.cmd == 'cls\n'){
        this.cmdHistory = []
      } else if(this.cmd == 'wpp\n'){
        this.cmdDetail = 'WhatsApp inciado'
        whatsApp();
      } else if(this.cmd == 'exit\n'){
        settings.console = false;
      } else if(this.cmd == 'client\n'){
        this.cmdDetail = 'WhatsApp inciado'
        whatsApp();
      } else{
        this.cmdDetail = 'Não é um comando reconhecido.'        
      }
      this.cmd = ''
    }

  },
  events: {
    closeEvent: function () {
      this.hideMenu()
    }
  }

})

document.getElementById("closeWindow").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     window.close();
});

document.getElementById("minimizeWindow").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   window.minimize();
});

document.getElementById("maximizeWindow").addEventListener("click", function (e) {
   var window = remote.getCurrentWindow();
   if (!window.isMaximized()) {
       window.maximize();
   } else {
       window.unmaximize();
   }
});

function whatsApp () {
  const BrowserWindow = remote.BrowserWindow
  //Definindo as janelas
  whatsAppWindow = new BrowserWindow({width: 1024, height: 768})
  // carregando o index.
  whatsAppWindow.loadURL('https://web.whatsapp.com')
  whatsAppWindow.setMenu(null)

  whatsAppWindow.on('closed', function () {
    whatsAppWindow = null
    livePush('O Aplicativo WhatsApp foi fechado.')
  })

  livePush('O Aplicativo WhatsApp foi aberto.')
}

function livePush(toPush){
  app.liveChange.push({detail:toPush})
}

function backUp() {
  /* a) pega a data atual formatada */
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var today = yyyy+'-'+mm+'-'+dd;
  /* FIM a) */

  var read = require('read-file-utf8') // Ler arquivos
  var dialog = remote.dialog // Carrega os dialogos do sistema
  var fs = require('fs'); // Carrega o File Sistem (CRUD)
  const fileExists = require('file-exists')
  var check = fileExists.sync(documentsPath + '/Molecule/db.json')
  var data = {}
  if(check == true){
    data = read(documentsPath + '/Molecule/db.json')

      dialog.showSaveDialog({title: 'Backup do banco de dados',defaultPath: '.\\backup' + today +'.json'},(fileName) => {
        try{
          fs.writeFile(fileName, data, (err) => {
            if(fileName === undefined){
              console.log('teste') }
            alert('O backup foi realizado com sucesso')
          })
        }
        catch(error){
       }
      })

  } else{
    alert('Não há banco de dados para salvar.')
  }
}

function importBackUp() {
  var read = require('read-file-utf8')
  var dialog = remote.dialog // Load the dialogs component of the OS
  var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

  dialog.showOpenDialog((fileNames) => {
    try {
      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
          if(err){
              alert("Um erro ocorreu ao ler o arquivo:");
              return;
          }
      });
    } catch(error){}

    try {var filepath = documentsPath + '/Molecule/db.json'
    var content = read(fileNames[0]);

    fs.writeFile(filepath, content, (err) => {
      if (err) {
          alert("Um erro ocorreu ao tentar atualizar o banco.");
          console.log(err);
          return;
      }
      alert("O banco de dados foi importado.");
      remote.getCurrentWindow().reload();
    })
  } catch(err){}
  });
}

function developerMode() {
  var r = confirm(lang.developerModeConfirm);
  if (r == true) {
    remote.getCurrentWindow().toggleDevTools();
    app.mode = 'dev'
    console.log(lang.developerModeOn)
  } else {
    app.mode = ''    
    console.log(lang.developerModeOff)
  }
}

function linkExt(link){
  var shell = require('electron').shell
  shell.openExternal(link);
}

// Shortcuts

document.addEventListener("keydown", function (e) {
  if (e.which == 112) {
    app.windowTab = 'index'
  } else if (e.which === 113) {
    app.windowTab = 'products'
  } else if (e.which === 114) {
    app.windowTab = 'sales'
  }
});

var Mousetrap = require('mousetrap');

Mousetrap.bind('ctrl+n', () => {
  app.createClient()
})
Mousetrap.bind('ctrl+p', () => {
  app.createProduct()
})
Mousetrap.bind('ctrl+s', () => {
  app.createSale()
})