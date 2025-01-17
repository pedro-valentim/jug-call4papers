package org.jugvale.cfp.model.impl;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;
import org.jugvale.cfp.model.DefaultModel;
import org.jugvale.cfp.model.config.Views;
import org.jugvale.cfp.model.enums.Nivel;

import com.fasterxml.jackson.annotation.JsonView;

@Entity
public class Participante extends DefaultModel {

	private static final long serialVersionUID = 1L;

	@Column(nullable = false)
	@JsonView(Views.Publico.class)
	@NotNull(message = "O nome não pode ser nulo")
	@NotEmpty(message = "O nome não pode ser vazio")
	private String nome;

	@NotNull(message = "Email não pode ser nulo")
	@NotEmpty(message = "Forneça um e-mail")
	@Column(unique = true, nullable = false)
	@JsonView(Views.Interno.class)
	private String email;

	@Column
	@JsonView(Views.Interno.class)
	@NotNull(message = "O RG não pode ser nulo")
	@NotEmpty(message = "Forneça um valor para o RG")
	private String rg;

	@Column
	@JsonView(Views.Interno.class)
	private String empresa;

	@Column
	@JsonView(Views.Interno.class)
	private String instituicao;

	@Column
	@Enumerated(EnumType.STRING)
	private Nivel nivel;

	public Participante() {

	}

	public Participante(String nome, String email, String rg, String empresa, String instituicao, Nivel nivel) {
		super();
		this.nome = nome;
		this.email = email;
		this.rg = rg;
		this.empresa = empresa;
		this.instituicao = instituicao;
		this.nivel = nivel;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRg() {
		return rg;
	}

	public void setRg(String rg) {
		this.rg = rg;
	}

	public String getEmpresa() {
		return empresa;
	}

	public void setEmpresa(String empresa) {
		this.empresa = empresa;
	}

	public String getInstituicao() {
		return instituicao;
	}

	public void setInstituicao(String instituicao) {
		this.instituicao = instituicao;
	}

	public Nivel getNivel() {
		return nivel;
	}

	public void setNivel(Nivel nivel) {
		this.nivel = nivel;
	}
}
