/*****************************************
 * author: yaoli<yaoli111144@gmail.com>
 * time:   2012-6-13
 * desc:   js for account
 ******************************************/

$(document).ready(function(){
	//初始化提示按钮
	//$('.alert').alert();

	//注册页面初始化
	/*  register functionalities */
	/* j-email is reused in both pages */
	$('.J-email').focus(function(){
		var val = $('input.J-email').val();
		var holder = $('input.J-email').attr('data-holder');
		if(val == holder){
			$('input.J-email').val('').css('color','#000');
		}


	});
	$('.J-email').blur(function(){
		var val = $('input.J-email').val();
		var holder = $('input.J-email').attr('data-holder');
		if(val == holder || val == ''){
			$(this).css('color', '#a0a0a0');
			$(this).val(holder);
		}
		/*
		var reg_mail = /^([\w\-\.]+(@|＠)[\w\-\.]+(\.\w+)+)$/;
		var email = $('input.J-email').val();
		if(email.match(reg_mail)){
			$('div.J-email').css('display', 'none');
		}else {
			$('div.J-email').css('display', 'block');
		}
		*/


	});

	$('.J-username').focus(function(){
		var val = $('input.J-username').val();
		var holder = $('input.J-username').attr('data-holder');
		if(val == holder){
			$('input.J-username').val('').css('color','#000');
		}


	});
	$('.J-username').blur(function(){
		var val = $('input.J-username').val();
		var holder = $('input.J-username').attr('data-holder');
		if(val == holder || val == ''){
			$(this).css('color', '#a0a0a0');
			$(this).val(holder);
		}
		/*
		var username = $('input.J-username').val();
		if(username.length < 6 || username == holder){
			$('div.J-username').css('display', 'block');
		}else{
			$('div.J-username').css('display', 'none');
		}
*/
	});


	$('.J-pwd').focus(function(){
		var val = $('input.J-pwd').val();
		var holder = $('input.J-pwd').attr('data-holder');
		if(val == holder){
			$('input.J-pwd').css('display','none');
			$('input.J-pwd-pwd').css('display','block');
			$('input.J-pwd-pwd').focus();
		}


	});
	$('.J-pwd-pwd').blur(function(){
		var val = $('input.J-pwd-pwd').val();
		var holder = $('input.J-pwd-pwd').attr('data-holder');
		if(val == holder || val == ''){
			$('input.J-pwd-pwd').css('display','none');
			$('input.J-pwd').css('display','block');
		}
		/*
		if(val.length < 6){
			$('div.J-pwd-pwd').css('display', 'block');
		}else{
			$('div.J-pwd-pwd').css('display', 'none');
		}
		*/


	});

		$('.J-pwd2').focus(function(){
		var val = $('input.J-pwd2').val();
		var holder = $('input.J-pwd2').attr('data-holder');
		if(val == holder){
			$('input.J-pwd2').css('display','none');
			$('input.J-pwd-pwd2').css('display','block');
			$('input.J-pwd-pwd2').focus();
		}


	});
	$('.J-pwd-pwd2').blur(function(){
		var val = $('input.J-pwd-pwd2').val();
		var val2 = $('input.J-pwd-pwd').val();
		var holder = $('input.J-pwd-pwd2').attr('data-holder');
		if(val == holder || val == ''){
			$('input.J-pwd-pwd2').css('display','none');
			$('input.J-pwd2').css('display','block');
		}
		/*
		if(val != val2 || val == ''){
			$('div.J-pwd-pwd2').css('display', 'block');
		}else{
			$('div.J-pwd-pwd2').css('display', 'none');
		}
*/

	});

	//验证注册信息
	function validate() {
		var flag = true,
			reg_mail = /^([\w\-\.]+(@|＠)[\w\-\.]+(\.\w+)+)$/,
			email = $('input.J-email').val(),
			username = $('input.J-username').val(),
			username_holder = $('input.J-username').attr('data-holder'),
			pwd1 = $('input.J-pwd-pwd').val(),
			pwd2 = $('input.J-pwd-pwd2').val();

		if(email.match(reg_mail)){
			$('div.J-email').css('display', 'none');

		}else {
			$('div.J-email').css('display', 'block');
			flag = false;
		}

		if(username.length < 6 || username == username_holder){
			$('div.J-username').css('display', 'block');
			flag = false;
		}else{
			$('div.J-username').css('display', 'none');
		}

		if(pwd1.length < 6){
			$('div.J-pwd-pwd').css('display', 'block');
			flag = false;
		}else{
			$('div.J-pwd-pwd').css('display', 'none');
		}

		if(pwd2 != pwd1 || pwd2 == ''){
			$('div.J-pwd-pwd2').css('display', 'block');
			flag = false;
		}else{
			$('div.J-pwd-pwd2').css('display', 'none');
		}

		if(flag){
			document.form1.submit();
		}else{
			return false;
		}
	}
	$('#J-submit').click(function(ev){
		ev.preventDefault();
		validate();
	});

	/*  login functionalities */
	function login_validate(){
		var flag = true,
			reg_mail = /^([\w\-\.]+(@|＠)[\w\-\.]+(\.\w+)+)$/,
			email = $('input.J-email').val(),
			password = $('#password').val();

			if(email.match(reg_mail)){
				$('div.J-email').css('display', 'none');
			}else {
				$('div.J-email').css('display', 'block');
				flag = false;
			}
			//console.log(password.length)
			if(password.length < 6){
				$('div.J_pwd').css('display', 'block');
				flag = false;
			}else{
				$('div.J_pwd').css('display', 'none');
			}
			if(flag){
				document.form1.submit();
			}else{				
				return false;
			}

	}
	$('#logbtn').click(function(ev){
		ev.preventDefault();
		login_validate();
	});

});