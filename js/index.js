      var read = require('read-file-utf8')
      var loki = require ('lokijs')
      const fileExists = require('file-exists')
      var db = new loki(__dirname+'/db.json')
      var check = fileExists.sync(__dirname+'/db.json')
      var data = {}
      console.log('%c SimpleGest ', 'background: #222; color: #bada55');
      if(check == true){
        console.log('O banco de dados existe.')
        data = read(__dirname+'/db.json')
        db.loadJSON(data)
        let colecoes = db['collections'].length
        console.log('O banco de dados foi carregado com sucesso.\n' + colecoes + ' coleções foram encontradas.')

      } else{
        db.addCollection('vendas')
        db.addCollection('clientes')
        db.addCollection('produtos')
        db.save()
        console.log('O banco de dados acabou de ser criado com todas as coleções necessárias. \n Bem vindo ao sistema.')
        alert('Bem vindo ao SimpleGest. Este programa é 100% gratuito e foi desenvolvido por Daniel Bonifácio.')
      }
      var clientes =  db.getCollection('clientes')

      window.Vue = require('vue')

      Vue.filter('searchFor', function (value, searchString) {
          var result = [];
          if(!searchString){
              return value;
          }

          alert('eiq')
          searchString = searchString.trim().toLowerCase();

          result = value.filter(function(item){
              if(item.product.toLowerCase().indexOf(searchString) !== -1){
                  return item;
              }
          })
              return result;
      })

      var app = new Vue({
        el: 'body',
        data: {
          clientes: [],
          client:{
            nome:'',
            cpf:'',
            telefone:'',
            genero:'',
          },
          mode:'',
          nomePesquisa:'',
          openModal: false
        },
        ready: function(){
          this.clientes = clientes.data
        },
        methods:{
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
            var r = confirm("Você realmente deseja deletar este cliente?");
            if (r == true) {
                console.log("Cliente " + this.client.nome + " deletado com sucesso.");
                clientes.remove(this.client);
                db.save()
                this.openModal=false
            } else {
                console.log("Você optou por não deletar o cliente.");
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
          },
          clientStoreOrUpdate: function(){
            if(typeof this.client.$loki != 'undefined'){
              clientes.update(this.client)
            } else {
              clientes.insert(this.client)
            }
            db.save()
            console.log('%c Cliente salvo com sucesso ', 'background: green; color: #fff;')
            this.openModal=false
          }
        },

      })
