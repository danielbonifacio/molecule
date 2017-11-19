	let round = require('vue-round-filter')
	var read = require('read-file-utf8')
	var loki = require ('lokijs')
	var db = new loki(__dirname+'/db.json')
	var data = read(__dirname+'/db.json')
	db.loadJSON(data)
	var vendas =  db.addCollection('vendas')
	window.Vue = require('vue')

	var vendas =	db.getCollection('vendas')
	var clientes =	db.getCollection('clientes')
	var produtos =	db.getCollection('produtos')

	var app = new Vue({
  filters: {
    round,
  },
	el: 'body',
	data: {
		mode:'',
		openModal:false,
		vendas:[],
		clientes:[],
		produtos:[],
		sale:{
			cliente:'',
			produto:'',
			preco:0,
			qtd:1,
			data:'',
			desconto:0,
		}

	},
	ready: function(){
		this.produtos = produtos.data
		this.clientes = clientes.data
		this.vendas = vendas.data
		// console.log(this.vendas)
	},
	methods:{
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
		  this.openModal = true
		  this.sale = sale
		},
		createSale: function(){
		  this.mode='cadastro'
		  this.openModal=true
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
		  this.openModal=false
		}
		}
	})
