const userService = require('./userService');
const { success } = require('../../middlewares/apiResponse');

exports.register = async (req, res) => {
    const { username, email, password, fullName } = req.body;

    const newUser = await userService.registerUser(username, email, password, fullName);

    return success(res, newUser, 'Conta criada com sucesso! Faça login para continuar.', 201);
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const { token, user } = await userService.loginUser(email, password);

    return success(res, { token, user }, 'Login realizado com sucesso!');
};

exports.logout = (req, res) => {
    return success(res, null, 'Logout realizado com sucesso.');
};

exports.getMyProfile = async (req, res) => {
    const user = await userService.getUserProfile(req.user.id);

    return success(res, user);
};

exports.updateProfile = async (req, res) => {
    const { fullName, bio } = req.body;
    const profilePicture = req.file ? req.file.filename : undefined;

    const updatedUser = await userService.updateUserProfile(req.user.id, { fullName, bio, profilePicture });

    return success(res, updatedUser, 'Perfil atualizado com sucesso!');
};

exports.getPublicProfile = async (req, res) => {
    const user = await userService.getPublicProfile(req.params.username);

    return success(res, user);
};
