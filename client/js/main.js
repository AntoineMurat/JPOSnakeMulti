hljs.initHighlightingOnLoad()

function resizeIframe(obj) {
	obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

/**
 * Lorsque la DOM sera chargée :
 */

$(function() {

	$(".btnContinue").click(function() {
		$('ul.tabs').tabs('select_tab', $(this).data('dest'));
	});

	/**
	 * Materialize
	 *
	 * On active le menu.
	 */

	$(".button-collapse").sideNav();

})