# Cadastro de carro

**RF**
Deve ser possivel cadastrar um novo carro.

**RN**
Não deve ser possivel cadastrar um carro com uma placa já existente.
O carro deve ser cadastrado,por padrão,com disponibilidade.
O usuario responsavel pelo cadastro deve ser um usuario administrador.

# Listagem de carros

**RF**
Deve ser possivel listar todos os carros disponiveis.
Deve ser possivel listar todos os carros disponiveis pelo nome da marca.
Deve ser possivel listar todos os carros disponiveis pelo nome da categoria.
Deve ser possivel listar todos os carros disponiveis pelo nome do carro.


**RN**
O usuario não precisa estar logado no sistema.


# Cadatro de Especificação no carro

**RF**
Deve ser possivel cadastrar uma especificação para um carro.

**RN**
Não deve ser possivel cadastrar uma espefficação para um carro não cadastrado.
Não deve ser possivel cadastrar uma especificação já existente para o mesmo carro.
O usuário responsavel pelo cadastro deve ser um usuário administrador.

# Cadasro de imagens do carro

**RF**
Deve ser possivel cadastrar a imagem do carro.
Deve ser possivel listar todos os carros.

**RNF**
Utilizar o mutler para upload dos arquivos

**RN**
O usuário deve poder cadastar mais de uma imagem para o mesmo carro.
O usuário responsavel pelo cadastro deve ser um usuário administrador.

# Aluguel de carro 

**RF**
Deve ser possivel cadastrar um aluguel.
**RNF**

**RN**
O aluguel deve ter duração minima de 24 horas.
Nao deve ser possivel cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário.
Nao deve ser possivel cadastrar um novo aluguel caso já exista um aberto para o mesmo carro.
Ao realizar um aluguel o status do carro deverá ser alterado para indisponível.

# Devolução do carro
**RF**
Deve ser possível realizar a devolução do carro.

**RN**
Se o carro for devolvido com menos de 24 horas, deverá ser cobrada a diária completa.
Ao realizar a devolução, o carro deverá ser liberado para outro aluguel.
Ao realizar a devolução, o usuário deverá ser liberado para outro aluguel.
Ao realizar a devolução, deverá ser calculado o total do aluguel.
Caso o horário de devolução seja superior ao horário previsto de entrega, deverá ser cobrado multa proporcional aos dias de atraso.
Caso haja multa, deverá ser somado ao total do aluguel.
O usuário deve estar logado para realizar a devolução

#listagem de aluguéis para usuário

**RF**
Deve ser possível realizar a busca de todos os aluguéis para o usuário

**RN** 
O usuário deve estar logado na aplicação

#Recuperar Senha

**RF**
Deve ser possível o usuário recuperar a senha informando o e-mail
O usuário deve receber um e-mail com o passo a passo para a recuperação da senha 
O usuário deve conseguir inserir uma nova senha 

**RN**
O usuário precisa informar uma nova senha
O link enviado para a recuperação deve expirar em 3 horas 
