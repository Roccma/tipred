import Ember from 'ember';

export default Ember.Route.extend({
	model(){
		$(function(){
			$('#contenedorEspere').fadeOut();
		});
	}
});
