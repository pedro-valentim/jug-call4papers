package org.jugvale.call4papers.rest.impl;

import java.util.Date;

import javax.ws.rs.core.MediaType;

import org.jboss.resteasy.client.ClientRequest;
import org.jboss.resteasy.client.ClientResponse;
import org.jboss.resteasy.spi.Link;
import org.jugvale.call4papers.model.impl.Evento;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

/**
 * 
 * @author Pedro Hos
 *
 */

//TODO: Para rodar os testes, o servidor deve estar "de pé"
public class EventoResourceImplIT {

	public static String SERVICES_CONTEXT = "http://localhost:8080/jug-call4papers/rest/v1";
	public static String EVENTO_CONTEXT = SERVICES_CONTEXT + "/evento";
	
	@Before
	public void setUp() throws Exception {}

	@Test
	public void deveRetornarStatus200ParaListaEventos() throws Exception {
		ClientResponse<?> response = new ClientRequest(EVENTO_CONTEXT).get();
		Assert.assertEquals(200, response.getStatus());
	}
	
	// ###### ESTE TESTE FALHA, VER COMO FAZER AUTENTICACAO #####
	@Test
	public void deveCriarEventoERetornarStatus201() throws Exception {
		Evento evento =  new Evento.Builder()
							   .comNome("O Grande Evento Segunda Edição")
							   .comDescricao("Esse é o melhor evento do mundo, o grande evento, "+
									   		 "se o primeiro foi melhor, o segundo melhor ainda...")
							   .comDataInicio(new Date())
							   .comDataFim(new Date())
							   .noLocal("Rua dos grandes eventos, numero: 88")
							   .comSite("http://www.ograndeevento.com")
							   .aceitandoTrabalhos()
							   .build();
		
		ClientResponse<?> response = new ClientRequest(EVENTO_CONTEXT)
											.body(MediaType.APPLICATION_JSON, evento)
											.post();
		
		Assert.assertEquals(201, response.getStatus());
		
		Link location = response.getLocation();
		Assert.assertEquals(EVENTO_CONTEXT + "/{id}", location.getHref());
	}

}
