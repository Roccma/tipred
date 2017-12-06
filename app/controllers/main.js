import Ember from 'ember';
import ENV from 'tipred/config/environment';

export default Ember.Controller.extend({
	actions : {
		login : function(){
			var email = this.get('email');
			var password = this.get('password');
			
			//alert(nickname + " - " + password);
			if(email && password){
				var usuario = this.store.createRecord('usuario',{
					email : email,
					password : password
				});
				$.ajax({
					async : false,
					url : 'http://192.168.1.43:3000/usuarios/sign_in',
					type : 'POST',
					dataType : 'json',
					data : {'user_login': 
									{'email' : email,
									'password' : password}}
				})
				.done(function(response){
					//console.log("éxito: " + JSON.stringify(response));
					if(response['success'] == true){
						localStorage.setItem("session", response['usuario'].nickname);
						localStorage.setItem("email", response['usuario'].email);
						localStorage.setItem("avatar", response['usuario'].avatar);
						localStorage.setItem("id", response['usuario'].id);
						localStorage.setItem("authentication_token", response['usuario'].authentication_token);
						//alert(response['usuario'].authentication_token);
						//alert(ENV.nickname);
						//ENV.email = response['usuario'].email;
						//ENV.avatar = response['usuario'].avatar;
						window.location = "/chat";
					}
					else{
						alert("incorrecto");
						$('#alertLogin').html("<strong>ERROR:</strong> Credenciales incorrectas");
						$('.rowAlert').fadeIn();
						setTimeout(function(){
							$('.rowAlert').fadeOut();
						}, 5000);
					}
				})
				.fail(function(error, err, e){
					//alert("incorrecto");
					$('#email').parent().addClass("has-error");
					$('#nickname').parent().removeClass("has-error");
					$('#email').focus();
					$('#alertLogin').html("<strong>ERROR:</strong> Credenciales incorrectas");
					$('.rowAlert').fadeIn();
					setTimeout(function(){
						$('.rowAlert').fadeOut();
					}, 5000);
				});
				this.setProperties({
					'email' : email,
					'password' : password
				});
			}
			else{
				if(!email){
					$('#email').parent().addClass("has-error");					
				}
				else{
					$('#nickname').parent().removeClass("has-error");
				}

				if(!password){
					$('#password').parent().addClass("has-error");	
				}
				else{
					$('#password').parent().removeClass("has-error");
				}

				$('#alertLogin').html("<strong>ERROR:</strong> No se han completado campos");
				$('.rowAlert').fadeIn();
				setTimeout(function(){
					$('.rowAlert').fadeOut();
				}, 5000);
			}
		},

		sign_up : function(){
			var there = this;
			var nickname = this.get('nickname');
			var email = this.get('email');
			var password = this.get('password');
			var confirmPassword = $('#confirmPassword').val();
			var facebook = this.get('facebook');
			var twitter = this.get('twitter');
			var instagram = this.get('instagram');
			var linkedin = this.get('linkedin'); 
			var avatar = ENV.avatar;

			if(!nickname){
		    	$('#registro_campoObligatorio').removeClass("alert-success");
		    	$('#registro_campoObligatorio').addClass("alert-danger");
				$('#nickname').focus();
				$('#registro_campoObligatorio').html('<b>ERROR:</b>&nbsp;No se han ingresado campos obligatorios');
				$('#registro_campoObligatorio').fadeIn();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
				}, 5000);
				return;
			}

			if(!email){
		    	$('#registro_campoObligatorio').removeClass("alert-success");
		    	$('#registro_campoObligatorio').addClass("alert-danger");
				$('#email').focus();
				$('#registro_campoObligatorio').html('<b>ERROR:</b>&nbsp;No se han ingresado campos obligatorios');
				$('#registro_campoObligatorio').fadeIn();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
				}, 5000);
				return;
			}

			if(!password){
		    	$('#registro_campoObligatorio').removeClass("alert-success");
		    	$('#registro_campoObligatorio').addClass("alert-danger");
				$('#password').focus();
				$('#registro_campoObligatorio').html('<b>ERROR:</b>&nbsp;No se han ingresado campos obligatorios');
				$('#registro_campoObligatorio').fadeIn();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
				}, 5000);
				return;
			}

			if(!confirmPassword){
		    	$('#registro_campoObligatorio').removeClass("alert-success");
		    	$('#registro_campoObligatorio').addClass("alert-danger");
				$('#confirmPassword').focus();
				$('#registro_campoObligatorio').html('<b>ERROR:</b>&nbsp;No se han ingresado campos obligatorios');
				$('#registro_campoObligatorio').fadeIn();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
				}, 5000);
				return;
			}

			if(password != confirmPassword){
		    	$('#registro_campoObligatorio').removeClass("alert-success");
		    	$('#registro_campoObligatorio').addClass("alert-danger");
				$('#password').focus();
				$('#registro_campoObligatorio').html('<b>ERROR:</b>&nbsp;La contraseña ingresada debe coincidir con su confirmación');
				$('#registro_campoObligatorio').fadeIn();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
				}, 5000);
				return;
			}

			/*var input = document.getElementById('fotoPerfil');
			if (input.files && input.files[0]) {
				//alert("omg");
				debugger;
		        var reader = new FileReader();
		        
		        reader.readAsDataURL(input.files[0]);
		        reader.onload = function (e) {

		        	var image = reader.result.split(",")[1];
	            	avatar = image;	
		        }

		    }
		    else{
		    	avatar = "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg";
		    }*/
		    //setTimeout(function(){
		    //alert("Avatar: " + avatar);
		    var usuario = there.store.createRecord('usuario',{
				nickname : nickname,
				email : email,
				password : password,
				avatar : avatar,
				facebook : facebook,
				twitter : twitter,
				instagram : instagram,
				linkedin : linkedin
			});
			
			/*usuario.save().then(function(saved){
			    console.log(saved.get('id'));
			});*/
		    //}, 20000);
		    usuario.save().then(function() {
		    	$('#registro_campoObligatorio').removeClass("alert-danger");
		    	$('#registro_campoObligatorio').addClass("alert-success");
		    	$('#registro_campoObligatorio').html('<b>¡ÉXITO!</b>&nbsp;El nuevo usuario ha sido agregado de manera correcta');
				$('#registro_campoObligatorio').fadeIn();
				ENV.avatar = "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg";
				$('#nickname').val("");
				$('#email').val("");
				$('#password').val("");
				$('#confirmPassword').val("");
				$('#facebook').val("");
				$('#instagram').val("");
				$('#twitter').val("");
				$('#linkedin').val("");
				var input = document.getElementById('fotoPerfil');
				input[0] = null;
				$('#imgPerfil').attr("src", "https://soygrowers.com/wp-content/uploads/2017/02/default_bio_600x600.jpg");
				$('#nickname').focus();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
				}, 5000);
		    }, function(error){
		    	$('#registro_campoObligatorio').addClass("alert-danger");
		    	$('#registro_campoObligatorio').removeClass("alert-success");
		    	$('#registro_campoObligatorio').html('<b>ERROR:</b>&nbsp;Campos únicos están repetidos');
				$('#registro_campoObligatorio').fadeIn();
				setTimeout(function(){
					$('#registro_campoObligatorio').fadeOut();
					$('#nickname').focus();
				}, 5000);
		    });
		    

		    //var promise = usuario.save();

			

		},

		genererNewToken : function(){
			var client_id = "e2c381926912977"; //Esto no cambia nunca, te lo da cuando registre la api en la pagina de imgur
			var client_secret = "45215ca8b76285e7a1cb4d5d93ce4d5f4d011ce9"; //Esto no cambia nunca, te lo da cuando registre la api en la pagina de imgur

			var form = new FormData();
			form.append("refresh_token", refreshToken);
			form.append("client_id", client_id);
			form.append("client_secret", client_secret);
			form.append("grant_type", "refresh_token");

			var settings = {
			  "async": true,
			  "crossDomain": true,
			  "url": "https://api.imgur.com/oauth2/token",
			  "method": "POST",
			  "headers": {},
			  "processData": false,
			  "contentType": false,
			  "mimeType": "multipart/form-data",
			  "data": form
			}

			$.getJSON(settings).done(function (response) {
			  console.log(response);
			  return response;
			  // respuesta=response;
			  // uploadImage(response.refresh_token, response.access_token)

			})
			.fail(function (response){
				return response;
				console.log(response);
			});
		},


		cargarFoto : function(){
			//document.getElementById('contenedorEspere').display = "block";
			$('#contenedorEspere').fadeIn();

			setTimeout(function(){
				if (input.files && input.files[0]) {
					//alert("cargar foto");
			        var reader = new FileReader();
			        reader.readAsDataURL(input.files[0]);
			        reader.onload = function (e) {
			            $('#imgPerfil').attr('src', e.target.result);
			            //ENV.avatar = e.target.result;
			            var image = reader.result.split(",")[1];
			            var refreshToken = ENV.refreshToken;
						var accessToken = ENV.access_token;
						var clientId = "e2c381926912977";
						var form = new FormData();
						form.append("image", image);
						
						var settings = {
						  "async": false,
						  "crossDomain": true,
						  "url": "https://api.imgur.com/3/image",
						  "method": "POST",
						  "headers": {
						    "authorization": "Client-ID "+clientId,
						    "authorization": "Bearer "+accessToken
						  },
						  "processData": false,
						  "contentType": false,
						  "mimeType": "multipart/form-data",
						  "data": form
						}

						$.ajax(settings)
						.done(function (response) {
						  /*console.log(response);
						  var qw = response;
						  alert(JSON.parse(response).data.link);*/
						  $('#contenedorEspere').fadeOut();
						  //document.getElementById('contenedorEspere').display = "none";
						  ENV.avatar = JSON.parse(response).data.link;
						  return response;
						}).fail(function(response){
							console.log(response.responseText);
							return response;
						});

			        }
			        

			        
		    	}

			}, 500);		
			var input = document.getElementById('fotoPerfil');

			//alert(ENV.access_token);
		},

	}
});
