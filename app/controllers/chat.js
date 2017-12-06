import Ember from 'ember';

export default Ember.Controller.extend({
	init(){
		this._super(...arguments);
		//this.contactos = JSON.parse(localStorage.getItem("contactIds"));
		this.id = localStorage.getItem("id");
		this.iniciarSocket();
	},

	socketio: Ember.inject.service('socket-io'),
	sitioSocket: "https://redtipsocket.herokuapp.com/",
	//contactos: [],

	iniciarSocket(){
		//alert(localStorage.getItem("id"));
		const socket = this.get('socketio').socketFor(this.sitioSocket + "?usuario=" + this.id);
		socket.on('mensaje', this.onMessage, this);
	},

	/*nuevoContacto(data){
		data.mensajes = []
		this.contactos.pushObject(data)
		$.ajax({
			url : "http://192.168.1.43:3000/usuarios/" + data.usuario + "?authentication_token=" + localStorage.getItem("authentication_token"),
			type : 'GET',
			dataType : 'json'
		})
		.done(function(response){
			var agregar = '<div class = "contactoData" id = "contactoData' + response['id'] + '"><div class = "contenedorImagen"><img src = "' + response['avatar'] + '" class = "imgChatContacto"/></div><div class = "contenedorNombreChatContacto">' + response['nickname'] + '</div></div>';
			$('.contenedorContactos').append(agregar);
		});
	},*/

	onMessage(data){
		alert("aca");
		var contactos = JSON.parse(localStorage.getItem("contactIds"))
		//debugger;
		for(var i = 0; i < contactos.length; i++){
			if(contactos[i] == data.emisor || contactos[i] == data.receptor){
				//alert("aca");
				var fecha = data.created_at.split(" ");
				var fechaSplit = fecha[0].split("-");
				var horaSplit = fecha[1].split(":");
				var f = fechaSplit[2] + "/" + fechaSplit[1] + "/" + fechaSplit[0];
				var h = horaSplit[0] + ":" + horaSplit[1];
				
				if(data.emisor == this.id){
					//alert("1");
					//texto, emisor, receptor, created_at
					if(data.receptor == localStorage.getItem("chatId")){
						var agregar = '<div class = "chatMensajeMio" id = "agregar"><div class = "chatFlechaMia"></div><div class = "chatContenidoMensajeMio">' + data.texto + '</div><div class = "chatHoraMia">' + f + " " + h + '</div></div>';
						$('.charlaMensajes').append(agregar);
						$('html,body').animate({
					        scrollTop: $('#charlaMensajes').offset().top
					    }, 1000);
					}
				}
				else{
					//alert("2");
					if(data.receptor == localStorage.getItem("chatId")){
						var agregar = '<div class = "chatMensajeOtro" id = "agregar"><div class = "chatFlechaOtro"></div><div class = "chatContenidoMensajeOtro">' + data.texto + '</div><div class = "chatHoraOtro">' + f + " " + h + '</div></div>';
						$('.charlaMensajes').append(agregar);						
						//document.getElementById('charlaMensajes').scrollTop = agregar.offsetTop;
						$('html,body').animate({
					        scrollTop: $('#charlaMensajes').offset().top
					    }, 1000);
					}
					else{
						//if(contactos.indexOf(data.emisor) != -1)
							$('#contenedorNombreChatContacto-' + data.emisor ).css('font-weight', 'bold');
						
						/*else{
							var usuario = data.emisor;
							//debugger;
							console.log("http://192.168.1.43:3000/usuarios/" + usuario + "?authentication_token=" + localStorage.getItem("authentication_token"));
							$.ajax({
								url : "http://192.168.1.43:3000/usuarios/" + usuario + "?authentication_token=" + localStorage.getItem("authentication_token"),
								type : 'GET',
								dataType : 'json'
							})
							.done(function(response){
								//debugger
								var agregar = '<div class = "contactoData" id = "contactoData' + response['data'].id + '"><div class = "contenedorImagen"><img src = "' + response['data'].attributes.avatar + '" class = "imgChatContacto"/></div><div class = "contenedorNombreChatContacto">' + response['data'].attributes.nickname + '</div></div>';
								$('.contenedorContactos').append(agregar);
								contactos[contactos.length] = usuario;
								localStorage.setItem("contactIds", JSON.stringify(contactos));
								there.onMessage(data);
							});
						}*/
					}
				}
				//contactos[i].mensajes.pushObject(data);
				
				return;
			}
		}
		var there = this;
		var usuario = (this.id == data.emisor) ? data.receptor : data.emisor;
		//debugger;
		console.log("http://192.168.1.43:3000/usuarios/" + usuario + "?authentication_token=" + localStorage.getItem("authentication_token"));
		$.ajax({
			url : "http://192.168.1.43:3000/usuarios/" + usuario + "?authentication_token=" + localStorage.getItem("authentication_token"),
			type : 'GET',
			dataType : 'json'
		})
		.done(function(response){
			//debugger
			var agregar = '<div class = "contactoData" id = "contactoData' + response['data'].id + '"><div class = "contenedorImagen"><img src = "' + response['data'].attributes.avatar + '" class = "imgChatContacto"/></div><div class = "contenedorNombreChatContacto">' + response['data'].attributes.nickname + '</div></div>';
			$('.contenedorContactos').append(agregar);
			contactos[contactos.length] = usuario;
			localStorage.setItem("contactIds", JSON.stringify(contactos));
			there.onMessage(data);
		});
	},

	actions : {
		crearSala : function(e){
			if($('#txtBuscarContacto').val() != "" && e.keyCode == 13){
				var buscarSplit = $('#txtBuscarContacto').val().split("-");
				var buscar = buscarSplit[0].trim();
				$.ajax({
					url : "http://192.168.1.43:3000/usuarios/find?search=" + buscar + "&authentication_token=" + localStorage.getItem("authentication_token"),
					type : 'GET',
					dataType : 'json'
				})
				.done(function(response){
					if(response['success'] == true){
						var usuarios = response['result'];
						var i = 0;
						while(i < usuarios.length){
							if(usuarios[i].nickname.toUpperCase() == buscar.toUpperCase()){
								$('.charlaMensajes').html("");
								localStorage.setItem("chatId", usuarios[i].id);
								if(localStorage.getItem("contactos").indexOf($('#txtBuscarContacto').val()) == -1){
									$('.imgChat').attr('src', usuarios[i].avatar);
									$('.contenedorNombreChat').html(buscar);
									$('.contenedorNoCharla').hide();
									$('.contenedorCharla').show();
									$('#txtBuscarContacto').val("");								
									return;
								}
								else{
									var id = usuarios[i].id;
									$('.imgChat').attr('src', $('#imgChatContacto-' + id).attr('src'));
									$('.contenedorNombreChat').html($('#contenedorNombreChatContacto-' + id).html());
									$.ajax({
										async : false,
										url : 'http://192.168.1.43:3000/chat/' + localStorage.getItem("id") + '?authentication_token=' + localStorage.getItem("authentication_token") + "&destinatario=" + id,
										type : 'GET',
										dataType : 'json'
									})
									.done(function(response){
										//console.log(response);

										$('#txtBuscarContacto').val("");
										$('.contenedorNoCharla').hide();					
										$('.contenedorCharla').show();
										var mensajes = response['resultado'];
										$('.charlaMensajes').html("");
										for(var i = 0; i < mensajes.length; i++){
											var fecha = mensajes[i].created_at.split("T");

											var fechaSplit = fecha[0].split("-");
											var horaSplit = fecha[1].split(":");
											var f = fechaSplit[2] + "/" + fechaSplit[1] + "/" + fechaSplit[0];
											var h = horaSplit[0] + ":" + horaSplit[1];
											if(mensajes[i].destinatario_id == localStorage.getItem("id")){
												var agregar = '<div class = "chatMensajeOtro"><div class = "chatFlechaOtro"></div><div class = "chatContenidoMensajeOtro">' + mensajes[i].contenido + '</div><div class = "chatHoraOtro">' + f + " " + h + '</div></div>';
												$('.charlaMensajes').append(agregar);
											}
											else{
												var agregar = '<div class = "chatMensajeMio"><div class = "chatFlechaMia"></div><div class = "chatContenidoMensajeMio">' + mensajes[i].contenido + '</div><div class = "chatHoraMia">' + f + " " + h  + '</div></div>';
												$('.charlaMensajes').append(agregar);
											}
										}
									});
								}
								
							}
							i++;
						}
					}
				});
			}
		},

		buscar : function(){
			var buscarSplit = $('#txtBuscarContacto').val().split("-");
			var buscar = buscarSplit[0].trim();
			$.ajax({
				url : "http://192.168.1.43:3000/usuarios/find?search=" + buscar + "&authentication_token=" + localStorage.getItem("authentication_token"),
				type : 'GET',
				dataType : 'json'
			})
			.done(function(response){
				if(response['success'] == true){
					var usuarios = response['result'];
					var i = 0;
					while(i < usuarios.length){
						if(usuarios[i].nickname.toUpperCase() == buscar.toUpperCase()){
							$('.charlaMensajes').html("");
							localStorage.setItem("chatId", usuarios[i].id);
							if(localStorage.getItem("contactos").indexOf($('#txtBuscarContacto').val()) == -1){
								$('.imgChat').attr('src', usuarios[i].avatar);
								$('.contenedorNombreChat').html(buscar);
								$('.contenedorNoCharla').hide();
								$('.contenedorCharla').show();
								$('#txtBuscarContacto').val("");								
								return;
							}
							else{
								var id = usuarios[i].id;
								$('.imgChat').attr('src', $('#imgChatContacto-' + id).attr('src'));
								$('.contenedorNombreChat').html($('#contenedorNombreChatContacto-' + id).html());
								$.ajax({
									async : false,
									url : 'http://192.168.1.43:3000/chat/' + localStorage.getItem("id") + '?authentication_token=' + localStorage.getItem("authentication_token") + "&destinatario=" + id,
									type : 'GET',
									dataType : 'json'
								})
								.done(function(response){
									//console.log(response);
									$('#txtBuscarContacto').val("");
									$('.contenedorNoCharla').hide();					
									$('.contenedorCharla').show();
									var mensajes = response['resultado'];
									$('.charlaMensajes').html("");
									for(var i = 0; i < mensajes.length; i++){
										var fecha = mensajes[i].created_at.split("T");
										var fechaSplit = fecha[0].split("-");
										var horaSplit = fecha[1].split(":");
										var f = fechaSplit[2] + "/" + fechaSplit[1] + "/" + fechaSplit[0];
										var h = horaSplit[0] + ":" + horaSplit[1];
										if(mensajes[i].destinatario_id == localStorage.getItem("id")){
											var agregar = '<div class = "chatMensajeOtro"><div class = "chatFlechaOtro"></div><div class = "chatContenidoMensajeOtro">' + mensajes[i].contenido + '</div><div class = "chatHoraOtro">' + f + " " + h + '</div></div>';
											$('.charlaMensajes').append(agregar);
										}
										else{
											var agregar = '<div class = "chatMensajeMio"><div class = "chatFlechaMia"></div><div class = "chatContenidoMensajeMio">' + mensajes[i].contenido + '</div><div class = "chatHoraMia">' + f + " " + h  + '</div></div>';
											$('.charlaMensajes').append(agregar);
										}
									}
								});
							}
						}
						i++;
					}
				}
			});
		},
		enviar : function(){
			var contenido = this.get('contenido');
			if(contenido){
				$.ajax({
					url : 'http://192.168.1.43:3000/mensajes/' + localStorage.getItem("id"),
					type : 'POST',
					data : {'authentication_token' : localStorage.getItem("authentication_token"),
							'destinatario' : localStorage.getItem("chatId"),
							'contenido' : contenido},
					dataType : 'json'
				})
				.done(function(response){
					$('#contenido').val("");
					$('#contenido').focus();
				});
			}
		}
	}
});
