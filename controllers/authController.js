// controllers/authController.js

const bcrypt = require('bcryptjs');
const { Usuarios } = require('../models');
const { generateJWT } = require('../utils/generateJWT');
const { logToBitacora } = require('../utils/bitacoraLogger');

// Mapa en memoria para limitar los intentos de inicio de sesión (podrías usar Redis o una DB para más eficiencia)
const loginAttempts = {};

const login = async (req, res, next) => {
  try {
    const { UserName, Password } = req.body;
    console.log(UserName);
    

    // Verificar que los campos de UserName y Password estén presentes
    if (!UserName || !Password) {
      // console.log(Username) Yo Osmar hice cambios aqui
      return res.status(400).json({ message: 'Por favor, ingrese ambos campos: nombre de usuario y contraseña.' });
    }

    // Verificar si el usuario ha superado los intentos de login
    if (loginAttempts[UserName] && loginAttempts[UserName] >= 5) {
      return res.status(429).json({ message: 'Demasiados intentos fallidos. Inténtelo de nuevo más tarde.' });
    }

    // Verificar si el usuario existe
    const user = await Usuarios.findOne({ where: { UserName } });
    if (!user) {
      incrementLoginAttempts(UserName);

      // Registrar intento de login fallido en la bitácora
      await logToBitacora('Autenticación', `Intento fallido de login para usuario: ${UserName}`, 'LOGIN_FAIL', `SELECT * FROM Usuarios WHERE UserName='${UserName}'`, 0);

      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      incrementLoginAttempts(UserName);
 
      // Registrar intento de login fallido en la bitácora
      await logToBitacora('Autenticación', `Intento fallido de login para usuario: ${UserName}`, 'LOGIN_FAIL', 'Comparación de contraseñas fallida', user.Id);
 
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Reiniciar contador de intentos fallidos al lograr un login exitoso
    resetLoginAttempts(UserName);

    // Generar el token JWT
    const token = generateJWT({ id: user.Id, role: user.IdRol });

    // Registrar login exitoso en la bitácora
    await logToBitacora('Autenticación', `Login exitoso para usuario: ${UserName}`, 'LOGIN_SUCCESS', `SELECT * FROM Usuarios WHERE UserName='${UserName}'`, user.Id);

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    next(error); // Delegamos el error al middleware de manejo de errores
  }
};

// Función para incrementar los intentos fallidos de login
const incrementLoginAttempts = (UserName) => {
  if (!loginAttempts[UserName]) {
    loginAttempts[UserName] = 1;
  } else {
    loginAttempts[UserName]++;
  }

  // Opción para limpiar el contador después de un tiempo (5 minutos, por ejemplo)
  setTimeout(() => {
    resetLoginAttempts(UserName);
  }, 5 * 60 * 1000); // 5 minutos
};

// Función para resetear los intentos fallidos de login
const resetLoginAttempts = (UserName) => {
  if (loginAttempts[UserName]) {
    delete loginAttempts[UserName];
  }
};

module.exports = { login };
