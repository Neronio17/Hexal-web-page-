$(function() {
	initValidation({
	    form: '.rf',
	});

});
// form validation function
function initValidation(o) {
	var settings = $.extend(true, {
		form: 'form.validate-form',
		controls: 'input[type=text], input[type=password], input[type=email], input[type=tel], input[type=number], input[type=url], textarea, select, input[type=checkbox]',
		controlParent: '',
		errorClass: 'error',
		successClass: 'success',
		regEmail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		regPhone: /^[0-9]+$/,
		customValidation: null,
		onSuccess: $.noop,
		onFail: $.noop
	}, o);

	$(settings.form).each(function () {
		var form = $(this).attr('novalidate', '');
		var successFlag = true;
		var controls = form.find(settings.controls);

		// form validation function
		function validateForm(e) {
			successFlag = true;

			controls.each(check);
			if($.isFunction(settings.customValidation) && !settings.customValidation(form, settings.successClass, settings.errorClass)) {
				successFlag = false;
			}

			if(!successFlag) {
				settings.onFail.call(this, e, form);
				return false;
			}
			else {
				settings.onSuccess.call(this, e, form);
			}
		} 

		// check control
		function check(i, obj) {
			var control = $(obj);
			var parent = settings.controlParent ? control.parents(settings.controlParent) : control.parent();

			// not empty fields
			if(control.hasClass('required')) {
				setState(parent, control, !control.val().length || control.val() === control.prop('defaultValue'), 'required');
			}
			// correct email fields
			if(control.hasClass('required-email')) {
				setState(parent, control, !settings.regEmail.test(control.val()), 'required-email');
			}
			// correct number fields
			if(control.hasClass('required-number')) {
				setState(parent, control, !settings.regPhone.test(control.val()), 'required-number');
			}
			// something selected
			if(control.hasClass('required-select')) {
				setState(parent, control, control.get(0).selectedIndex === 0, 'required-select');
			}
			// something checked
			if(control.hasClass('required-chk')) {
				setState(parent, control, control[0].checked === false, 'required-chk');
			}
		}

		// set state
		function setState(parent, control, error, errorType) {
			parent.removeClass(settings.errorClass).removeClass(settings.successClass); 
			if(error) {
				parent.addClass(settings.errorClass);
				parent.addClass(errorType);
                // console.log("parent", parent);
                // console.log("control", control);
                // console.log("error", error);
				control.one('focus', function () {
					parent.removeClass(settings.errorClass).removeClass(settings.successClass);
					parent.removeClass('required');
                    // parent.removeClass (function (index, className) {
                    //     return (className.match (/\brequired-\S+/g) || []).join(' ');
                    // });
				});
				successFlag = false;
			}
			
			else {
				parent.addClass(settings.successClass);

			}
		}





		// form event handlers
	    form.submit(validateForm);
		//form.validate({

		//    submitHandler: function (form) {
		//        alert('submit');
		//        //$.ajax({
		//        //    url: 'response.php',
		//        //    type: 'POST',
		//        //    data: $(form).serialize(),
		//        //    success: function (response) {
		//        //        $('#' + form.id + ' .ht-response-data').html(response);
		//        //    }
		//        //});
		//    }
		//});




	});

}