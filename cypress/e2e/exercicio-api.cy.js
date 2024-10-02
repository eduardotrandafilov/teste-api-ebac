/// <reference types="cypress" />

import contrato from "../contracts/usuarios.contract";
import {faker} from "@faker-js/faker"

describe('Testes da Funcionalidade Usuários', () => {
  beforeEach(() => {

  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response=>{
      return contrato.validateAsync(response.body)
    })
  })

  it('Deve listar usuários cadastrados com sucesso', () => {
     cy.request({
      method: 'GET',
      url:'usuarios'
     }).should(response=>{
        expect(response.status).equal(200)
        expect(response.body).property('usuarios')
      })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.request({
      method:'POST',
      url:'usuarios',
      body:{
          "nome": faker.internet.userName() ,
          "email": faker.internet.email(),
          "password": "teste",
          "administrador": "true"
      }
    }).should((response)=>{
      expect(response.body.message).equal('Cadastro realizado com sucesso')
      expect(response.status).equal(201)
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    //TODO: 
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    //TODO: 
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    //TODO: 
  });

});
