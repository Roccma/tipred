import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		$(function(){
			//$('#txtBuscarContacto').autocomplete("jquery", "JavaScript", "PHP");
			$('.nombreSession').html(localStorage.getItem("session"));
			$('.imgPerfil').attr('src', localStorage.getItem("avatar"));
			console.log('http://192.168.1.43:3000/usuarios?authentication_token=' + localStorage.getItem("authentication_token"));
			$.ajax({
				async : false,
				url : 'http://192.168.1.43:3000/usuarios?authentication_token=' + localStorage.getItem("authentication_token"),
				type : 'GET',
				dataType : 'json'
			})
			.done(function(response){
				var usuarios = response['data'];
				var opciones = [];
				for(var i = 0; i < usuarios.length; i++){
					if(usuarios[i].id != localStorage.getItem("id"))
						opciones[i] = usuarios[i]["attributes"].nickname + " - " + usuarios[i]["attributes"].email;
				}
				$('#txtBuscarContacto').autocomplete({
				  source: opciones
				});
			});

			$.ajax({
				async: false,
				url : 'http://192.168.1.43:3000/contactos/' + localStorage.getItem("id") + '?authentication_token=' + localStorage.getItem("authentication_token"),
				type : 'GET',
				dataType : 'json'
			})
			.done(function(response){
				var contactos = response['contactos'];
				var contacts = [];
				var contactIds = [];
				for(var i = 0; i < contactos.length; i++){
					contacts[i] = contactos[i].nickname + " - " + contactos[i].email;
					contactIds[i] = contactos[i].id;
					var agregar = '<div class = "contactoData" id = "contactoData-' + contactos[i].id + '"><div class = "contenedorImagen"><img src = "' + contactos[i].avatar + '" class = "imgChatContacto" id="imgChatContacto-' + contactos[i].id + '"/></div><div class = "contenedorNombreChatContacto" id="contenedorNombreChatContacto-' + contactos[i].id +'">' + contactos[i].nickname + '</div></div>';
					$('.contenedorContactos').append(agregar);
				}
				localStorage.setItem("contactos", contacts);
				localStorage.setItem("contactIds", JSON.stringify(contactIds));
			});

			$('.contactoData').on('click', function(){
				//alert($(this));

				var idSplit = $(this).attr('id').split("-");
				var id = idSplit[1];
				localStorage.setItem("chatId", id);
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

					//2017-12-06T04:14:33.502Z
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

			});
		});	

	}
});
