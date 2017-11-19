	let round = require('vue-round-filter')
	var read = require('read-file-utf8')
	var loki = require ('lokijs')
	var db = new loki(__dirname+'/db.json')
	var data = read(__dirname+'/db.json')
	db.loadJSON(data)
	// var produtos =  db.addCollection('produtos')
	window.Vue = require('vue')

	var produtos =	db.getCollection('produtos')

	var app = new Vue({
	filters:{
		round,
	},
	el: 'body',
	data: {
		mode:'',
		openModal:false,
		produtos:[],
		product:{
			nome:'',
			preco:'',
			qtd:0
		}

	},
	ready: function(){
		this.produtos = produtos.data
		// console.log(this.produtos)
	},
	methods:{
		saveDb: function(){
			db.save()
		},
		randomizeProducts: function(size) {
			for (var i = 0; i < size; i++) {
				this.product = {
					nome: 'Random',
					preco: Math.floor(Math.random() * (598 - 12 + 1) + 12),
					qtd: Math.floor(Math.random() * (200 - 1 + 1) + 1)
				}
				produtos.insert(this.product)
			}
		},
		editProduct: function(product){
		  this.mode='edicao'
		  this.openModal = true;
		  this.product = product;
		},
		createProduct: function(){
		  this.mode='cadastro'
		  this.openModal=true
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
	            this.openModal=false
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
		  this.openModal=false
		}
		}
	})
