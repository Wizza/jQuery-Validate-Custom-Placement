$(document).ready(function(){
	
	// Setup Defaults
	$.validator.setDefaults({
		errorPlacement: _errorPlacement,
		highlight: _adjustLabel,
		showErrors: _overrideShowErrors
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
		
		var eleWidth = eleClone.outerWidth() + 1;
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
	
	// Overriding the internal function from jQuery Validate defaultShowErrors
	// This is due to that the labels inner html is updated and we are using the
	// highlight setting to recalculate the width and previously "this.showLabel" was being called after
	// this.settings.highlight.call was being called and the new text hadn't yet been updated for the new width to be calculated.
	function _overrideShowErrors(){
		var i, elements, error;
		for ( i = 0; this.errorList[ i ]; i++ ) {
			error = this.errorList[ i ];
			
			this.showLabel( error.element, error.message );
			
			if ( this.settings.highlight ) {
				this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
			}
		}
		if ( this.errorList.length ) {
			this.toShow = this.toShow.add( this.containers );
		}
		if ( this.settings.success ) {
			for ( i = 0; this.successList[ i ]; i++ ) {
				this.showLabel( this.successList[ i ] );
			}
		}
		if ( this.settings.unhighlight ) {
			for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
				this.settings.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
			}
		}
		this.toHide = this.toHide.not( this.toShow );
		this.hideErrors();
		this.addWrapper( this.toShow ).show();
	}
	
});
