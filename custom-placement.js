$(document).ready(function(){
	
	// Setups
	$.validator.setDefaults({
		errorPlacement: _errorPlacement,
		onfocusout: _onfocusout,
		onkeyup: _onkeyup
	});
	
	// Error placement Calculation methods
	function _errorPlacement(error, element){
		var eleWidth = element.outerWidth(true);
		var direction = element.data('direction') || 'down';
		
		// Normal Inputs, Select, Textarea Wrappers
		if(!element.is('[type="radio"]') && !element.is('[type="checkbox"]')){
			element.wrap('<span class="validation-wrap" />');
			element.parent().css('width', eleWidth);

		// Group Radio Wrapper
		} else if(element.is('[type="radio"]') || element.is('[type="checkbox"]')){
			var errorWrap = $('input[name="' + element.attr('name') + '"]').parent().wrapAll('<span class="validation-wrap" />').parent();
		}
		
		error.insertAfter(element);
		error.addClass('validation-error ' + direction).css('width', _elementWidth(error));
		error.css(_errorElementPos(error, element));
	}
	
	function _elementWidth(ele){
		var eleClone = ele.clone();
		eleClone.attr('style', '');
		eleClone.css('visibility', 'hidden').appendTo('body');
		
		// Can't use jQuery outerWidth() here as it rounds down the decimal point width and the text in the label can wrap
		// Always round up just to make sure there is enough room for the text not to wrap
		var eleWidth = Math.ceil(eleClone[0].getBoundingClientRect().width);
		eleClone.remove();
		
		return eleWidth;
	}
	
	function _errorElementPos(error, ele){
		var pos = {};
		var errorWrap = error.parents('.validation-wrap');
		var direction = ele.data('direction') || 'down';
		
		if(direction == 'down'){
			var left = errorWrap.width() - 130 > 0 ? errorWrap.width() - 130 : 0;
			pos = { top: -error.outerHeight() - 2, left: left };
			
		} else if(direction == 'left'){
			pos = { top: ele.height() / 2 - 6, left: errorWrap.width() + 2 };
		}
		
		return pos;
	}
	
	function _adjustLabel(element){
		if($(element).parents('.validation-wrap').length > 0){
			var errorEle = $(element).parents('.validation-wrap').find('.validation-error');
			errorEle.css('width', _elementWidth(errorEle));
		}
	}
	
	// Override internal function with added _adjustLabel function
	// Functions are copied from jQuery Validate source but have _adjustLabel function call added within
	function _onfocusout(element){
		if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
			this.element( element );
			
			// Call adjust label function
			_adjustLabel( element );
		}
	}
	
	function _onkeyup( element, event ) {
		if ( event.which === 9 && this.elementValue( element ) === "" ) {
			return;
		} else if ( element.name in this.submitted || element === this.lastElement ) {
			this.element( element );
			
			// Call adjust label function
			_adjustLabel( element );
		}
	}
	
});