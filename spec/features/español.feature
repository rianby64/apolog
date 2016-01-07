# language: es
Característica: La posibilidad de escribir en español
  Antecedentes: Que se ejecutan antes de la escena
    Dado un antecedente
    Y unas ideas
    E intencionalmente otras ideas
  Escenario: Describir una escena simple
    Dado un tema
    Dada una tarea
    Dados unos datos
    Dadas unas ideas
    Cuando ejecuto ésto de aquí
    Entonces obtengo un escenario en español simple
  Esquema del escenario: Describir una escena <tipoDeEscena>
    Dado un tema
    Cuando ejecuto ésto de aquí
    Entonces obtengo un escenario en español <tipoDeEscenario>
    Pero Al ejecutar ésto otro
    Entonces obtengo un escenario mucho mejor
    Ejemplos:
      | tipoDeEscena | tipoDeEscenario |
      | compleja     | complejo        |
      | complicada   | complicado      |
      | fácil        | difícil         |
      
