const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UserController {
  /**
   * index - GET para listar Varios registros
   * show - GET exibir um registro especifico
   * create - POST criar um registro
   * update - PUT para atualizart o registro
   * delete - DELETE para remover um registro
   */

  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExist = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    ); // (?) busca o vetor seguinte

    if (checkUserExist) {
      throw new AppError("Esse email já está em uso");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, hashedPassword]
    ); // SQL with JS

    return response.status(201).json();

    //if(!name){throw new AppError("O nome é obrigatorio");//response.status(201).json({ name, email, password });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);
    if (!user) {
      throw new AppError("Usuario não encontrado!");
    }

    const userWithUpdateEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Esse email já está em uso");
    }

    user.name = name ?? user.name; //Nullesh operation  se tem conteudo usa o primeiro senão atribui um novo
    user.email = email ?? user.email;

    // Tratamento de informações
    if (password && !old_password) {
      throw new AppError("Necessario informar a senha antiga");
    }

    if (password == old_password) {
      throw new AppError("As senhas não podem ser iguais");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }
    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      update_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );

    return response.json();
  }
}

module.exports = UserController;
