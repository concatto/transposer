var NOTAS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

var TECLAS = [
	'1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
	'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
	'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
	'z', 'x', 'c', 'v', 'b', 'n', 'm'
];

function stringParaNota(str) {
	return {
		letra: str.charAt(0),
    	sharp: str.length == 3,
    	oitava: parseInt(str.length == 3 ? str.charAt(2) : str.charAt(1))
	};
}

function notaParaInt(nota) {
	var value = (((nota.letra.charCodeAt(0) - 'A'.charCodeAt(0)) + 5) % 7) * 2;
	if (value > 5) value--;
	if (nota.sharp) value++;

	return value + (nota.oitava * 12);
}

function intParaNota(valor) {
    var intermediate = valor % 12;
    var letterValue = (intermediate < 4) ? Math.floor(intermediate / 2.0) : Math.ceil(intermediate / 2.0);
	return {
        letra: String.fromCharCode(((letterValue + 2) % 7) + 'A'.charCodeAt(0)),
        sharp: intermediate % 2 == (intermediate <= 4 ? 1 : 0),
        oitava: Math.floor(valor / 12)
	};
}

function transpor(texto, valor) {
	var regex = /[A-Z]|#|[0-9]/g;
	var novoTexto = "";
	var linhas = texto.split("\n");
	for (var l = 0; l < linhas.length; l++) {
		var notas = [];
		var linha = linhas[l];
		var str = "";
		var ignore = false;
		for (var i = 0; i <= linha.length; i++) {
			if (linha.charAt(i) == "*") {
				ignore = true;
			}
			if (ignore) {
				novoTexto += linha.charAt(i);
				continue;
			}
			if (linha.charAt(i).match(regex)) {
				str += linha.charAt(i);
			} else if (str.length > 1) {
				var nota = intParaNota(notaParaInt(stringParaNota(str)) + valor);
				novoTexto += nota.letra + (nota.sharp ? "#" : "") + nota.oitava + linha.charAt(i);
				str = "";
			} else {
				novoTexto += linha.charAt(i);
			}
		}

		novoTexto += str;
		if (l != linhas.length - 1) novoTexto += "\n";
	}
	return novoTexto;
}

function paraReal(texto) {
	var linhas = texto.split("\n");
	var asterisco = false;
	var sharp = false;

	var stringCompleta = "";
	for (var l = 0; l < linhas.length; l++) {
		var chars = linhas[l].split("");
		asterisco = false;

		for (var i = 0; i < chars.length; i++) {
			var c = chars[i];

			if (c == '*') {
				asterisco = true;
				stringCompleta += c;
			} else if (c == '^') {
				sharp = true;
			} else {
				c = c.toLowerCase();

				var indice = $.inArray(c, TECLAS);

				if (indice != -1 && !asterisco) {
					var nota = NOTAS[indice % NOTAS.length];

					stringCompleta += nota;
					if (sharp || c != chars[i]) {
						stringCompleta += "#";
						sharp = false;
					}
					stringCompleta += parseInt(Math.floor(indice / NOTAS.length) + 2, 10);
					if (chars[i + 1] != " " && chars[i + 1] != ")") {
						stringCompleta += " ";
					}
				} else {
					stringCompleta += chars[i];
				}
			}
		}

		if (l < linhas.length - 1) stringCompleta += "\n";
	}
	return stringCompleta;
}

function paraVirtual(texto) {
	var linhas = texto.split("\n");
	var asterisco = false;
	var sharp = false;

	var stringCompleta = "";
	for (var l = 0; l < linhas.length; l++) {
		var chars = linhas[l].split("");
		asterisco = false;
		var indiceNota = -1;

		for (var i = 0; i < chars.length; i++) {
			var c = chars[i];

			if (c == '*') {
				asterisco = true;
				stringCompleta += c;
			} else if (c == '#') {
				sharp = true;
				if (!asterisco) stringCompleta += c;
			} else {
				var indice = $.inArray(c.toUpperCase(), NOTAS);

				if (indice != -1) {
					indiceNota = indice;
				} else if ($.isNumeric(c) && !asterisco) {
					var tecla = TECLAS[indiceNota + (parseInt(c, 10) - 2) * NOTAS.length];
					if (typeof tecla !== "undefined" && indiceNota != -1) {
						if (sharp) {
							if ($.isNumeric(tecla)) {
								stringCompleta += "^"
							}
							stringCompleta += tecla.toUpperCase();
							sharp = false;
						} else {
							stringCompleta += tecla;
						}
					}
					indiceNota = -1;
				} else if ($.inArray(c.toLowerCase(), TECLAS) == -1) {
					stringCompleta += c;
				}
			}
		}

		if (l < linhas.length - 1) stringCompleta += "\n";
	}
	return stringCompleta;
}
