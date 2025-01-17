// globais
var inscritosEvento = {};

// inicialização
$(function() {
	// com angular td seria mais fácil ..
	// como é página fechada de admin, vamos fazer td travando a UI msm
	var eventos = buscaEventos();
	// listeners
	$("#filtroParticipante").keyup(function(){
		var inscritosFiltrados = $.grep(inscritosEvento, function(inscrito, i) {
			var filtro = $("#filtroParticipante").val();
			var nome = inscrito.participante.nome;
			var rg = inscrito.participante.rg;
			if(nome.indexOf(filtro) != -1 ||  rg.indexOf(filtro) != -1){
				return inscrito
			}
		});
		mostrarInscritos(inscritosFiltrados);
	})
	$("#filtroEvento").keyup(function(){
		var eventosFiltrados = $.grep(eventos, function(evt, i) {
			var filtro = $("#filtroEvento").val();
			var nome = evt.nome;
			if(nome.indexOf(filtro) != -1 ) {
				return evt
			}
		});
		mostrarEventos(eventosFiltrados);
	})
	
	$('#btnNovoEvento').click(function() {
		if(!haErrosNosForms()) {
			var evento = {};
			evento.nome = $("#nome").val();
			evento.descricao = $("#descricao").val();
			evento.dataInicio = converteData($("#dataInicio").val());
			evento.dataFim = converteData($("#dataFim").val());			
			evento.local = $("#local").val();
			evento.url = $("#input_site").val();	
			EventoResource.criar({
				$entity: evento,
				$callback: function(httpCode, xmlHttpRequest) {	
					if(httpCode == 201) {
						alert("Evento criado com sucesso!");
						limpaCamposForm();
						buscaEventos();
					} else {
						alert("Problema encontrando quando adicionando o evento");
					}
				}
			});
			
		}
	});
	// depois de td
	atualizaInscritos();
});

function buscaEventos() {
	var eventos = EventoResource.listarTodos();
	eventos.sort(function(a, b) {
		var d1 = new Date(a.dataFim);
		var d2 = new Date(b.dataFim);
		return d1 < d2;
	});
	var eventosOptions = $("#eventosOptions");
	$.each(eventos, function(key, evt) {
		eventosOptions.append($("<option />").val(evt.id).text(evt.nome));
	});
	
	mostrarEventos(eventos);
	eventosOptions.change(atualizaInscritos);
	return eventos;
}

function atualizaInscritos() {
	EventoResource.buscarInscritosTodosCampos({
		eventoId: $("#eventosOptions").val(),
		$callback: function(httpCode, xmlHttpRequest, inscritos) {	
			inscritosEvento = inscritos;
			$("#totalInscritos").html(inscritos.length);
			mostrarInscritos(inscritos)
		}
	})
};

function mudaInscricoesAbertas(id) {
	EventoResource.mudaInscricoesAbertas({
		eventoId: id,
		$callback: function(httpCode, xmlHttpRequest) {	
			if(httpCode == 200) {
				buscaEventos()
			}
		}
	})
}

function mudaAceitandoPapers(id) {
	EventoResource.mudaAceitandoPapers({
		eventoId: id,
		$callback: function(httpCode, xmlHttpRequest) {	
			if(httpCode == 200) {
				buscaEventos()
			}
		}
	})
}

function mudaPresenca(id) {
	InscricaoResource.mudaPresenca({
		inscricaoId: id,
		$callback: function(httpCode, xmlHttpRequest, inscritos) {	
			if(httpCode == 200) {
				 atualizaInscritos();
			} else {
				alert("Erro mudando presença");
			}
		}
	})
}

function cancelaInscricao(id) {
	var confirmacaoApagar = confirm("Deseja mesmo anular essa inscrição?");
	if(!confirmacaoApagar) {
		return;
	};
	InscricaoResource.anulaInscricao({
		inscricaoId: id,
		$callback: function(httpCode, xmlHttpRequest, resposta) {	
			if(httpCode == 200) {
				alert(resposta);
				atualizaInscritos();
			} else {
				alert("Erro cancelando presença");
			}
		}
	})
}

function mostrarInscritos(inscritos) {
	var inscritosHtml = ""
	$.each(inscritos, function(key, inscrito) {
		inscritosHtml += "<tr>";
		inscritosHtml += "<td>" + inscrito.participante.nome  + "</td>";
		inscritosHtml += "<td>" + inscrito.participante.rg  + "</td>";
		inscritosHtml += "<td><button onclick='mudaPresenca(" + inscrito.id + ")' class='btn btn-default'>"
		if(inscrito.compareceu) {
			inscritosHtml += "Cancelar Presença"
		} else {
			inscritosHtml += "Marcar Presença"
		}
		inscritosHtml += "</button></td>"
		inscritosHtml += "<td><button onclick='cancelaInscricao(" + inscrito.id + ")' class='btn btn-default'>Cancelar</button>";
		inscritosHtml += "</tr>";
	});
	$("#inscritosFiltrados").html(inscritosHtml);
}


function mostrarEventos(eventos){
	var agora = new Date();
	var eventosHtml = "";
	$.each(eventos, function(key, evt) {
		eventosHtml += "<tr>";
		if(new Date(evt.dataFim) > agora) {
			eventosHtml += "<td style='color: blue'>"
		} else {
			eventosHtml += "<td style='color: red'>"
		}
		eventosHtml += evt.nome;
		eventosHtml += " (<a href='./evento.html?id=" + evt.id + "' target='_new'>Ver página</a> )";
		eventosHtml += " (<a href='./rest/evento/admin/"+ evt.id + "/inscritos/baixar' target='_new'>ver inscritos</a>)";
		eventosHtml += "</td>"
		eventosHtml += "<td><button onclick='mudaInscricoesAbertas(" + evt.id + ")' class='btn btn-default'>"
		if(evt.inscricoesAbertas){
			eventosHtml += "Fechar inscrições"
		}else {
			eventosHtml += "Abrir inscrições"
		}
		eventosHtml += "</td>"
		eventosHtml += "<td><button onclick='mudaAceitandoPapers(" + evt.id + ")' class='btn btn-default'>"
		if(evt.aceitandoTrabalhos){
			eventosHtml += "Fechar Call4Papers"
		}else {
			eventosHtml += "Abrir Call4Papers"
		}
		eventosHtml += "</td>"
		eventosHtml +=	"</li>";
	});
	$("#todosEventos").html(eventosHtml);
}